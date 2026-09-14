#!/usr/bin/env node
/**
 * 双主题视觉巡检脚本。
 *
 * 起文档站 dev server，遍历全部组件文档页，在浅色/暗色两种主题下截取
 * demo 区域，输出截图集与画廊页到 output/visual-audit/，用于人工快速
 * 巡检暗色模式下组件样式的正确性（缺少暗色变量、硬编码色值等问题会
 * 直接反映在截图对比中）。
 *
 * 用法：
 *   node scripts/visual-audit.mjs [--layer=all|base|pro] [--port=4175]
 *     常规巡检；若存在基线 output/visual-baseline/ 则自动做像素 diff。
 *   node scripts/visual-audit.mjs --save-baseline
 *     本次截图写入基线（无 diff）。
 *   node scripts/visual-audit.mjs --render-only
 *     仅用 output/visual-audit/shots 已有截图重新渲染画廊。
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};
const layer = getArg("layer", "all");
const port = Number(getArg("port", "4175"));
const baseURL = `http://127.0.0.1:${port}`;

const outDir = path.join(repoRoot, "output", "visual-audit");
const baselineDir = path.join(repoRoot, "output", "visual-baseline");
const saveBaseline = args.includes("--save-baseline");
const renderOnly = args.includes("--render-only");
if (!renderOnly) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "shots"), { recursive: true });
}

function loadPages() {
  const pages = [];
  const addLayer = (manifestPath, urlPrefix, layerName) => {
    if (layer !== "all" && layer !== layerName) return;
    const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, manifestPath), "utf8"));
    for (const entry of manifest) {
      pages.push({ name: entry.name, docsText: entry.docsText, url: `${urlPrefix}/${entry.name}`, layer: layerName });
    }
  };
  addLayer("packages/components/component-manifest.json", "/components", "base");
  addLayer("packages/pro-components/component-manifest.json", "/pro-components", "pro");
  return pages;
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseURL}/`);
      if (res.ok) return;
    } catch {
      // server 未就绪，继续等待
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`文档站未能在 120s 内就绪：${baseURL}`);
}

const results = [];

async function auditPage(browser, pageEntry) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  });
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${String(err).slice(0, 300)}`));

  const shots = { light: [], dark: [] };
  try {
    await page.goto(`${baseURL}${pageEntry.url}`, { waitUntil: "networkidle", timeout: 90_000 });
  } catch {
    await page.goto(`${baseURL}${pageEntry.url}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  }
  await page.waitForTimeout(500);

  const capture = async (theme) => {
    await page.evaluate((mode) => {
      const html = document.documentElement;
      if (mode === "dark") html.setAttribute("data-theme", "dark");
      else html.removeAttribute("data-theme");
    }, theme);
    await page.waitForTimeout(250);
    const demos = await page.locator(".vp-demo").all();
    const list = [];
    for (let i = 0; i < demos.length; i += 1) {
      const el = demos[i];
      try {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const file = `shots/${pageEntry.layer}-${pageEntry.name}-${theme}-${String(i + 1).padStart(2, "0")}.png`;
        await el.screenshot({ path: path.join(outDir, file), animations: "disabled" });
        list.push(file);
      } catch (err) {
        consoleErrors.push(`demo#${i + 1} 截图失败: ${String(err).slice(0, 150)}`);
      }
    }
    return list;
  };

  shots.light = await capture("light");
  shots.dark = await capture("dark");
  await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));

  results.push({
    ...pageEntry,
    light: shots.light,
    dark: shots.dark,
    demoCount: Math.max(shots.light.length, shots.dark.length),
    consoleErrors: [...new Set(consoleErrors)],
  });
  await context.close();
}

function renderReport() {
  const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const groups = new Map();
  for (const r of results) {
    if (!groups.has(r.layer)) groups.set(r.layer, []);
    groups.get(r.layer).push(r);
  }
  const sections = [...groups.entries()]
    .map(([layerName, list]) => {
      const cards = list
        .map((r) => {
          const imgs = [];
          for (let i = 0; i < r.demoCount; i += 1) {
            const idx = String(i + 1).padStart(2, "0");
            for (const theme of ["light", "dark"]) {
              const f = `shots/${r.layer}-${r.name}-${theme}-${idx}.png`;
              if (r[theme].includes(f)) {
                imgs.push(
                  `<figure><a href="${f}" target="_blank"><img src="${f}" loading="lazy" alt="${r.name} ${theme} ${idx}"></a><figcaption>${r.docsText} · demo ${idx} · ${theme}</figcaption></figure>`
                );
              }
            }
          }
          const marks = [];
          for (let i = 0; i < r.demoCount; i += 1) {
            const idx = String(i + 1).padStart(2, "0");
            for (const theme of ["light", "dark"]) {
              const f = `shots/${r.layer}-${r.name}-${theme}-${idx}.png`;
              const status = r.diffStatus?.[f];
              if (status && status !== "match") {
                const ratio = r.diffRatio?.[f];
                marks.push(
                  `<li class="mark ${status}">${theme} demo ${idx}：${
                    status === "regressed"
                      ? `差异 ${(ratio * 100).toFixed(2)}% <a href="${f.replace("shots/", "diffs/")}" target="_blank">diff 图</a>`
                      : status === "new"
                        ? "基线中不存在（新增）"
                        : "尺寸与基线不一致"
                  }</li>`
                );
              }
            }
          }
          const diffBlock =
            marks.length > 0
              ? `<details class="diff"><summary>⚠ ${marks.length} 处与基线不同</summary><ul>${marks.join("")}</ul></details>`
              : r.diffStatus
                ? `<div class="ok">✓ 与基线一致</div>`
                : "";
          const errors = r.consoleErrors.length
            ? `<div class="err"><strong>${r.consoleErrors.length} 条 console 错误</strong><ul>${r.consoleErrors
                .map((e) => `<li>${escape(e)}</li>`)
                .join("")}</ul></div>`
            : "";
          return `<section><h3>${escape(r.docsText)} <code>${r.name}</code>（${r.demoCount} 个 demo）</h3><div class="grid">${imgs.join("")}</div>${diffBlock}${errors}</section>`;
        })
        .join("\n");
      return `<h2>${layerName === "base" ? "基础组件" : "增强组件"}（${list.length}）</h2>${cards}`;
    })
    .join("\n");

  const totalDemos = results.reduce((n, r) => n + r.demoCount, 0);
  const errorPages = results.filter((r) => r.consoleErrors.length > 0);
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>双主题视觉巡检报告</title>
<style>
body{font-family:system-ui,sans-serif;margin:24px;background:#f6f6f6;color:#222}
h2{margin-top:40px;border-bottom:2px solid #ddd;padding-bottom:8px}
section{background:#fff;border-radius:12px;padding:16px;margin:16px 0}
.grid{display:flex;flex-wrap:wrap;gap:12px}
figure{margin:0;max-width:300px}
img{width:100%;border:1px solid #e3e3e3;border-radius:8px}
figcaption{font-size:12px;color:#666;margin-top:4px}
.err{margin-top:8px;font-size:13px;color:#b3001b;background:#fff2f2;border-radius:8px;padding:8px}
.err ul{margin:4px 0 0 18px;padding:0}
.diff{margin-top:8px;font-size:13px}
.diff summary{color:#b45309}
.diff .mark.regressed{color:#b3001b}
.diff .mark.new,.diff .mark.size{color:#555}
.ok{margin-top:8px;font-size:12px;color:#0a7a3d}
summary{cursor:pointer;font-size:14px;color:#555}
</style></head><body>
<h1>双主题视觉巡检报告</h1>
<p>组件页 ${results.length} 个 · demo 截图 ${totalDemos} 组 · console 报错页面 ${errorPages.length} 个</p>
<details><summary>存在 console 错误的页面</summary><ul>${errorPages.map((r) => `<li>${r.layer}/${r.name}（${r.consoleErrors.length}）</li>`).join("") || "<li>无</li>"}</ul></details>
${sections}
</body></html>`;
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

if (renderOnly) {
  const files = fs.readdirSync(path.join(outDir, "shots")).sort();
  const map = new Map();
  for (const f of files) {
    const m = f.match(/^(base|pro)-(.+)-(light|dark)-(\d+)\.png$/);
    if (!m) continue;
    const key = `${m[1]}/${m[2]}`;
    if (!map.has(key)) {
      map.set(key, { name: m[2], docsText: m[2], url: "", layer: m[1], light: [], dark: [], consoleErrors: [] });
    }
    map.get(key)[m[3]].push(`shots/${f}`);
  }
  for (const r of map.values()) {
    r.demoCount = Math.max(r.light.length, r.dark.length);
    results.push(r);
  }
  renderReport();
  console.log(`画廊已重新生成：${path.join(outDir, "index.html")}`);
  process.exit(0);
}

/** 与基线做像素对比，结果写入 result.diffStatus / result.diffRatio */
function compareWithBaseline() {
  if (saveBaseline || !fs.existsSync(baselineDir)) return;
  const pixelmatchFn = pixelmatch.default ?? pixelmatch;
  const diffDir = path.join(outDir, "diffs");
  fs.mkdirSync(diffDir, { recursive: true });

  for (const r of results) {
    for (let i = 0; i < r.demoCount; i += 1) {
      const idx = String(i + 1).padStart(2, "0");
      for (const theme of ["light", "dark"]) {
        const f = `shots/${r.layer}-${r.name}-${theme}-${idx}.png`;
        const currentPath = path.join(outDir, f);
        const baselinePath = path.join(baselineDir, f);
        if (!fs.existsSync(baselinePath)) {
          r.diffStatus ??= {};
          r.diffStatus[f] = "new";
          continue;
        }
        try {
          const a = PNG.sync.read(fs.readFileSync(baselinePath));
          const b = PNG.sync.read(fs.readFileSync(currentPath));
          if (a.width !== b.width || a.height !== b.height) {
            r.diffStatus ??= {};
            r.diffStatus[f] = "size";
            continue;
          }
          const diffPng = new PNG({ width: a.width, height: a.height });
          const diffPixels = pixelmatchFn(a.data, b.data, diffPng.data, a.width, a.height, { threshold: 0.1 });
          const ratio = diffPixels / (a.width * a.height);
          r.diffStatus ??= {};
          r.diffStatus[f] = ratio > 0.005 ? "regressed" : "match";
          if (r.diffStatus[f] === "regressed") {
            fs.writeFileSync(path.join(diffDir, f.split("/")[1]), PNG.sync.write(diffPng));
          }
          r.diffRatio ??= {};
          r.diffRatio[f] = ratio;
        } catch (err) {
          console.error(`对比失败 ${f}: ${err}`);
        }
      }
    }
    // 注：countdown/charts 等 JS 驱动 demo 理论上是 diff 噪音源，但实测两次独立
    // 运行 1064 张截图全一致（文档 demo 未启自动播放/动画），暂不引入跳过名单；
    // 若未来文档 demo 增加自动播放内容，把对应组件加入本函数开头做排除即可。
  }
}

/** 巡检结束后维护基线目录 */
function syncBaseline() {
  if (!saveBaseline) return;
  const failedShots = results.reduce(
    (n, r) => n + (r.consoleErrors.filter((e) => e.includes("截图失败")).length ? 1 : 0),
    0
  );
  if (failedShots > 0) {
    console.log(`有 ${failedShots} 个页面存在截图失败，本次不更新基线（避免基线出现空洞）`);
    return;
  }
  fs.rmSync(baselineDir, { recursive: true, force: true });
  fs.cpSync(path.join(outDir, "shots"), path.join(baselineDir, "shots"), { recursive: true });
  console.log(`基线已更新：${baselineDir}`);
}

const server = spawn("pnpm", ["--filter", "@xiaoye/docs", "exec", "vitepress", "dev", ".", "--host", "127.0.0.1", "--port", String(port)], {
  cwd: repoRoot,
  stdio: "ignore",
  detached: true,
});

try {
  await waitForServer();
  const pages = loadPages();
  const browser = await chromium.launch();
  for (const pageEntry of pages) {
    process.stdout.write(`审计 ${pageEntry.layer}/${pageEntry.name} ...\n`);
    await auditPage(browser, pageEntry);
  }
  await browser.close();
  compareWithBaseline();
  renderReport();
  syncBaseline();
  const errorPages = results.filter((r) => r.consoleErrors.length > 0);
  const statusCount = { match: 0, regressed: 0, new: 0, size: 0 };
  for (const r of results) {
    for (const s of Object.values(r.diffStatus ?? {})) statusCount[s] += 1;
  }
  console.log(`\n完成：${results.length} 个组件页，${results.reduce((n, r) => n + r.demoCount, 0)} 组 demo 截图`);
  if (saveBaseline) {
    console.log("模式：保存基线（未做对比）");
  } else if (Object.keys(statusCount).some((k) => statusCount[k] > 0)) {
    console.log(`像素对比：一致 ${statusCount.match} · 差异 ${statusCount.regressed} · 新增 ${statusCount.new} · 尺寸变化 ${statusCount.size}`);
    if (statusCount.regressed > 0 || statusCount.size > 0) process.exitCode = 1;
  }
  console.log(`console 报错页面：${errorPages.length === 0 ? "无" : errorPages.map((r) => `${r.layer}/${r.name}`).join(", ")}`);
  console.log(`报告：${path.join(outDir, "index.html")}`);
} finally {
  try {
    if (server.pid) process.kill(-server.pid, "SIGTERM");
  } catch {
    // server 进程组可能已退出
  }
}
