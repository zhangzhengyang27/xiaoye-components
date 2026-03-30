import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "packages/components/component-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const componentNames = manifest.map((entry) => entry.name);
const styleNames = manifest.flatMap((entry) => entry.styleImports);

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function listBasenames(relativeDir, extension) {
  return fs
    .readdirSync(path.join(repoRoot, relativeDir))
    .filter((file) => file.endsWith(extension))
    .map((file) => file.slice(0, -extension.length))
    .sort();
}

function listComponentTestGroups() {
  const componentsDir = path.join(repoRoot, "packages/components");
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) =>
      fs.existsSync(path.join(componentsDir, name, "__tests__")) &&
      fs
        .readdirSync(path.join(componentsDir, name, "__tests__"))
        .some((file) => file.endsWith(".spec.ts"))
    )
    .sort();
}

function collectByRegex(source, regex, groupIndex = 1) {
  return [...source.matchAll(regex)].map((match) => match[groupIndex]).sort();
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function fail(message, values) {
  console.error(message);
  if (values.length > 0) {
    values.forEach((value) => {
      console.error(`- ${value}`);
    });
  }
  process.exitCode = 1;
}

const componentDirs = fs
  .readdirSync(path.join(repoRoot, "packages/components"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const exportedComponentNames = collectByRegex(
  readFile("packages/components/index.ts"),
  /export \* from "\.\/([^"]+)";/g
);

const docComponentNames = listBasenames("apps/docs/components", ".md").filter(
  (name) => name !== "overview"
);

const typeFixtureNames = listBasenames("tests/types/fixtures", ".ts").filter((name) =>
  componentNames.includes(name)
);
const unitTestNames = listComponentTestGroups();

const themeImportNames = collectByRegex(
  readFile("packages/theme/index.css"),
  /@import "\.\/src\/components\/([^.]+)\.css";/g
);

const mismatches = [
  {
    message: "组件目录与 manifest 不一致：",
    values: [
      ...diff(componentNames, componentDirs),
      ...diff(componentDirs, componentNames).map((name) => `${name} (多余目录)`)
    ]
  },
  {
    message: "导出入口与 manifest 不一致：",
    values: [
      ...diff(componentNames, exportedComponentNames),
      ...diff(exportedComponentNames, componentNames).map((name) => `${name} (多余导出)`)
    ]
  },
  {
    message: "组件文档与 manifest 不一致：",
    values: [
      ...diff(componentNames, docComponentNames),
      ...diff(docComponentNames, componentNames).map((name) => `${name} (多余文档)`)
    ]
  },
  {
    message: "类型夹具与 manifest 不一致：",
    values: [
      ...diff(componentNames, typeFixtureNames),
      ...diff(typeFixtureNames, componentNames).map((name) => `${name} (多余夹具)`)
    ]
  },
  {
    message: "组件单测与 manifest 不一致：",
    values: [
      ...diff(componentNames, unitTestNames),
      ...diff(unitTestNames, componentNames).map((name) => `${name} (多余单测目录)`)
    ]
  },
  {
    message: "样式入口与 manifest 不一致：",
    values: [
      ...diff(styleNames, themeImportNames),
      ...diff(themeImportNames, styleNames).map((name) => `${name} (多余样式导入)`)
    ]
  }
];

mismatches
  .filter((entry) => entry.values.length > 0)
  .forEach((entry) => fail(entry.message, entry.values));

if (process.exitCode !== 1) {
  console.log(`组件一致性校验通过，共校验 ${componentNames.length} 个公开组件。`);
}
