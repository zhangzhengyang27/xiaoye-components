import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "packages/xiaoye-ui/component-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const componentNames = manifest.map((entry) => entry.name);

function listBasenames(relativeDir, extension) {
  return fs
    .readdirSync(path.join(repoRoot, relativeDir))
    .filter((file) => file.endsWith(extension))
    .map((file) => file.slice(0, -extension.length))
    .sort();
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function listUIPanelDirs() {
  const dir = path.join(repoRoot, "packages/xiaoye-ui/src/front-components");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function listHeadlessDirs() {
  const dir = path.join(repoRoot, "packages/xiaoye-ui/src/headless");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function checkCSSImports() {
  const cssSource = readFile("packages/xiaoye-ui/style.css");
  const missing = [];
  componentNames.forEach((name) => {
    const cssImport = `./src/front-components/${name}/${name}.css`;
    if (!cssSource.includes(cssImport)) {
      missing.push(cssImport);
    }
  });
  return missing;
}

const uiPanelDirs = listUIPanelDirs();
const headlessDirs = listHeadlessDirs();
const styleImportIssues = checkCSSImports();

function fail(message, values) {
  console.error(message);
  if (values.length > 0) {
    values.forEach((value) => {
      console.error(`- ${value}`);
    });
  }
  process.exitCode = 1;
}

const mismatches = [
  {
    message: "前台专属组件目录缺失：",
    values: diff(componentNames, uiPanelDirs)
  },
  {
    message: "前台专属组件样式入口缺失：",
    values: styleImportIssues
  }
];

mismatches
  .filter((entry) => entry.values.length > 0)
  .forEach((entry) => fail(entry.message, entry.values));

if (process.exitCode !== 1) {
  console.log(`xiaoye-ui 一致性校验通过，共 ${componentNames.length} 个前台专属组件，${headlessDirs.length} 个 Headless 组合 API。`);
}
