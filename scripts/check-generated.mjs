#!/usr/bin/env node
/**
 * 生成物漂移守卫：校验"由事实源生成"的产物是否与事实源保持同步。
 *
 * 流程：快照当前生成物到临时目录 → 重新执行生成命令 → 逐文件对比
 * （--ignore 可按行正则过滤时间戳等易变行）→ 无论通过与否都还原快照，
 * 保证对工作区零副作用（不能用 git diff 判断，本地未提交改动会误报）。
 * 失败时把重新生成的产物保留在临时目录作为证据，并输出修复处方。
 *
 * 用法示例：
 *   node scripts/check-generated.mjs --name tokens \
 *     --generate "node scripts/generate-tokens.mjs" --path packages/tokens/src
 *   node scripts/check-generated.mjs --name llms \
 *     --generate "node scripts/generate-llm-files.mjs" --path llms-full.txt \
 *     --ignore "^> 自动生成于"
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();

function parseArgs(argv) {
  const args = { path: [], ignore: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === "--path" || flag === "--ignore") {
      args[flag.slice(2)].push(argv[(i += 1)]);
    } else if (flag === "--name" || flag === "--generate") {
      args[flag.slice(2)] = argv[(i += 1)];
    } else {
      throw new Error(`未知参数：${flag}`);
    }
  }
  if (!args.name || !args.generate || args.path.length === 0) {
    throw new Error("缺少参数：--name、--generate 和至少一个 --path 均为必填");
  }
  return args;
}

/** 列出目标下的全部文件（相对仓库根的路径）；目标是单文件时返回它自身。 */
function collectFiles(target) {
  const abs = path.join(repoRoot, target);
  if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [target];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile()) files.push(child);
    }
  };
  walk(abs);
  return files.map((file) => path.relative(repoRoot, file));
}

/** 还原快照：删掉生成新造的文件、写回快照内容、清理生成留下的空目录。 */
function restore(snapshot, targets, knownDirs) {
  for (const target of targets) {
    for (const rel of collectFiles(target)) {
      if (!snapshot.has(rel)) fs.rmSync(path.join(repoRoot, rel));
    }
  }
  for (const [rel, content] of snapshot) {
    const abs = path.join(repoRoot, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  for (const target of targets) {
    const abs = path.join(repoRoot, target);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue;
    const dirs = [];
    const walk = (dir) => {
      dirs.push(dir);
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
      }
    };
    walk(abs);
    for (const dir of dirs.reverse()) {
      if (fs.readdirSync(dir).length === 0 && !knownDirs.has(dir)) fs.rmdirSync(dir);
    }
  }
}

function filterLines(content, ignores) {
  return content.split("\n").filter((line) => !ignores.some((regex) => regex.test(line)));
}

function diffEntries(rel, beforeText, afterText, ignores) {
  const before = filterLines(beforeText, ignores);
  const after = filterLines(afterText, ignores);
  const diffs = [];
  const total = Math.max(before.length, after.length);
  for (let i = 0; i < total && diffs.length < 5; i += 1) {
    if (before[i] !== after[i]) {
      diffs.push({ line: i + 1, before: before[i], after: after[i] });
    }
  }
  return { rel, before, after, diffs };
}

const { name, generate, path: targets, ignore: ignoreArgs } = parseArgs(process.argv.slice(2));
const ignorePatterns = ignoreArgs.map((pattern) => new RegExp(pattern));

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `xy-check-${name}-`));
const snapshot = new Map();
const knownDirs = new Set();
for (const target of targets) {
  const abs = path.join(repoRoot, target);
  if (fs.existsSync(abs)) knownDirs.add(fs.statSync(abs).isDirectory() ? abs : path.dirname(abs));
  for (const rel of collectFiles(target)) {
    snapshot.set(rel, fs.readFileSync(path.join(repoRoot, rel), "utf8"));
  }
}

let failed = false;
try {
  execSync(generate, { stdio: "inherit", cwd: repoRoot });
} catch {
  console.error(`[check:${name}] 生成命令执行失败：${generate}`);
  failed = true;
}

const entries = [];
if (!failed) {
  const afterFiles = new Map();
  for (const target of targets) {
    for (const rel of collectFiles(target)) {
      afterFiles.set(rel, fs.readFileSync(path.join(repoRoot, rel), "utf8"));
    }
  }
  for (const rel of new Set([...snapshot.keys(), ...afterFiles.keys()])) {
    if (!snapshot.has(rel)) {
      entries.push({ rel, reason: "生成新增、工作区缺失" });
    } else if (!afterFiles.has(rel)) {
      entries.push({ rel, reason: "生成后缺失" });
    } else {
      const diff = diffEntries(rel, snapshot.get(rel), afterFiles.get(rel), ignorePatterns);
      if (diff.diffs.length > 0 || diff.before.length !== diff.after.length) entries.push(diff);
    }
  }
  failed = entries.length > 0;
}

if (failed) {
  const evidenceDir = path.join(tempRoot, "regenerated");
  for (const target of targets) {
    for (const rel of collectFiles(target)) {
      const dest = path.join(evidenceDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(repoRoot, rel), dest);
    }
  }
  console.error(`[check:${name}] 重新生成产物已保留为证据：${evidenceDir}（工作区快照即将原样还原）`);
}

restore(snapshot, targets, knownDirs);

if (failed) {
  console.error(`[check:${name}] 生成物与事实源不同步（${entries.length} 处）：`);
  for (const entry of entries) {
    console.error(`  - ${entry.rel}${entry.reason ? `（${entry.reason}）` : ""}`);
    for (const diff of entry.diffs ?? []) {
      console.error(`    L${diff.line}: ${JSON.stringify(diff.before)} -> ${JSON.stringify(diff.after)}`);
    }
  }
  console.error(`[check:${name}] 处方：运行 ${generate} 后随事实源一并提交`);
  process.exit(1);
}

fs.rmSync(tempRoot, { recursive: true, force: true });
console.log(`[check:${name}] 生成物与事实源一致（${snapshot.size} 个文件）`);
