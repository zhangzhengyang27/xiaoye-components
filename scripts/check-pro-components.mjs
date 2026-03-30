import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "packages/pro-components/component-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const componentNames = manifest.map((entry) => entry.name);
const styleNames = manifest.flatMap((entry) => entry.styleImports);
const rootTypeWhitelist = {
  "search-form": ["SearchFormField", "SearchFormInstance", "SearchFormProps"],
  "pro-form": ["ProFormInstance", "ProFormProps"],
  "overlay-form": ["OverlayFormInstance", "OverlayFormProps", "OverlayFormSubmitPayload"],
  "steps-form": ["StepsFormInstance", "StepsFormProps", "StepsFormStep"],
  "filter-panel": ["FilterPanelProps"],
  "request-form": ["RequestFormProps", "RequestFormSubmitContext"],
  "pro-table": ["ProTableColumn", "ProTableInstance", "ProTableProps"],
  "column-setting-panel": ["ColumnSettingPanelColumn", "ColumnSettingPanelProps"],
  "saved-view-tabs": ["SavedViewTabItem", "SavedViewTabsProps"],
  "table-filter-drawer": ["TableFilterDrawerProps"],
  "import-result-table": ["ImportResultSummary", "ImportResultTableProps"],
  "audit-timeline": ["AuditTimelineAttachment", "AuditTimelineEntry", "AuditTimelineProps"],
  "detail-panel": ["DetailPanelInstance", "DetailPanelProps"],
  "detail-page": [
    "DetailPageAction",
    "DetailPageAttachmentFile",
    "DetailPageBreadcrumbItem",
    "DetailPageProps"
  ],
  "async-state-container": ["AsyncStateContainerProps"],
  "list-page": ["ListPageActionRef", "ListPageBatchAction", "ListPageProps"],
  "crud-page": ["CrudPageProps"],
  "split-layout-page": ["SplitLayoutPageProps"],
  "approval-flow-panel": ["ApprovalFlowNode", "ApprovalFlowPanelProps"],
  "import-wizard": ["ImportWizardProps", "ImportWizardStep"],
  "export-task-panel": ["ExportTaskItem", "ExportTaskPanelProps"],
  core: [
    "ProActionRef",
    "ProFieldSchema",
    "ProFieldSchemaBuiltinComponent",
    "ProFieldSchemaOption",
    "ProPageAction",
    "ProRequestActionRef",
    "ProRequestContext",
    "ProRequestData",
    "ProRequestResult"
  ]
};

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

function collectByRegex(source, regex, groupIndex = 1) {
  return [...source.matchAll(regex)].map((match) => match[groupIndex]).sort();
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function normalizeNamedExports(source, regex) {
  const result = {};

  for (const match of source.matchAll(regex)) {
    const names = match[1]
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .sort();

    result[match[2]] = names;
  }

  return result;
}

function diffNamedExportMap(expected, actual) {
  const messages = [];
  const expectedKeys = Object.keys(expected).sort();
  const actualKeys = Object.keys(actual).sort();

  diff(expectedKeys, actualKeys).forEach((key) => {
    messages.push(`${key} (缺少导出块)`);
  });

  diff(actualKeys, expectedKeys).forEach((key) => {
    messages.push(`${key} (多余导出块)`);
  });

  expectedKeys.forEach((key) => {
    if (!actual[key]) {
      return;
    }

    const missing = diff(expected[key], actual[key]).map((name) => `${key} -> ${name} (缺少导出)`);
    const extra = diff(actual[key], expected[key]).map((name) => `${key} -> ${name} (多余导出)`);

    messages.push(...missing, ...extra);
  });

  return messages.sort();
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

function listProComponentDirs() {
  const componentsDir = path.join(repoRoot, "packages/pro-components");
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== "__tests__")
    .sort();
}

function listProComponentTestGroups() {
  const componentsDir = path.join(repoRoot, "packages/pro-components");
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

function extractDemoPaths(source) {
  const paths = [];
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^:::\s*demo\b/.test(lines[index].trim())) {
      continue;
    }

    let cursor = index + 1;

    while (cursor < lines.length) {
      const line = lines[cursor].trim();

      if (!line) {
        cursor += 1;
        continue;
      }

      if (line === ":::") {
        break;
      }

      paths.push(line);
      break;
    }
  }

  return [...new Set(paths)];
}

function collectDocDemoMismatches(relativePaths) {
  const mismatches = [];

  relativePaths.forEach((relativePath) => {
    const source = readFile(relativePath);
    const demoPaths = extractDemoPaths(source);

    demoPaths.forEach((demoPath) => {
      const vuePath = path.join(repoRoot, "apps/docs/examples", `${demoPath}.vue`);

      if (!fs.existsSync(vuePath)) {
        mismatches.push(`${relativePath} -> ${demoPath}.vue 缺失`);
      }
    });
  });

  return mismatches.sort();
}

const componentDirs = listProComponentDirs();
const exportsSource = readFile("packages/pro-components/exports.ts");
const rootIndexSource = readFile("packages/pro-components/index.ts");
const exportedComponentNames = collectByRegex(
  exportsSource,
  /export(?:\s+\{[^}]+\}\s+from|\s+\*\s+from)\s+"\.\/*([^"]+)";/g
);
const exportedComponentValues = normalizeNamedExports(
  exportsSource,
  /export\s+\{([^}]+)\}\s+from\s+"\.\/*([^"]+)";/g
);
const rootTypeExports = normalizeNamedExports(
  rootIndexSource,
  /export type\s+\{([\s\S]*?)\}\s+from\s+"\.\/*([^"]+)";/g
);
const docComponentNames = listBasenames("apps/docs/pro-components", ".md").filter(
  (name) => name !== "overview"
);
const exampleDocNames = listBasenames("apps/docs/examples/pro", ".md").filter(
  (name) => name !== "overview"
);
const typeFixtureNames = listBasenames("tests/types/fixtures", ".ts").filter((name) =>
  componentNames.includes(name)
);
const unitTestNames = listProComponentTestGroups();
const styleImportNames = collectByRegex(
  readFile("packages/pro-components/style.css"),
  /@import "\.\.\/theme\/src\/pro\/([^.]+)\.css";/g
);
const docFiles = fs
  .readdirSync(path.join(repoRoot, "apps/docs/pro-components"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => `apps/docs/pro-components/${name}`);
const exampleDocFiles = fs
  .readdirSync(path.join(repoRoot, "apps/docs/examples/pro"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => `apps/docs/examples/pro/${name}`);
const proTypeFixtureExists = fs.existsSync(
  path.join(repoRoot, "tests/types/fixtures/xiaoye-pro-components.ts")
);

const mismatches = [
  {
    message: "增强公开组件目录缺失：",
    values: diff(componentNames, componentDirs)
  },
  {
    message: "增强导出入口与 manifest 不一致：",
    values: [
      ...diff(componentNames, exportedComponentNames),
      ...diff(exportedComponentNames, componentNames).map((name) => `${name} (多余导出)`)
    ]
  },
  {
    message: "增强值导出白名单与 manifest 不一致：",
    values: diffNamedExportMap(
      Object.fromEntries(
        manifest.map((entry) => [entry.name, [...entry.installExports].sort()])
      ),
      exportedComponentValues
    )
  },
  {
    message: "增强组件文档缺失：",
    values: diff(componentNames, docComponentNames)
  },
  {
    message: "增强示例文档缺失：",
    values: diff(componentNames, exampleDocNames)
  },
  {
    message: "增强类型夹具缺失：",
    values: diff(componentNames, typeFixtureNames)
  },
  {
    message: "增强组件单测缺失：",
    values: diff(componentNames, unitTestNames)
  },
  {
    message: "增强样式入口缺失：",
    values: diff(styleNames, styleImportNames)
  },
  {
    message: "增强文档 demo 引用缺失：",
    values: [
      ...collectDocDemoMismatches(docFiles),
      ...collectDocDemoMismatches(exampleDocFiles)
    ]
  },
  {
    message: "增强聚合包类型夹具缺失：",
    values: proTypeFixtureExists ? [] : ["tests/types/fixtures/xiaoye-pro-components.ts"]
  },
  {
    message: "增强根入口类型白名单与约定不一致：",
    values: diffNamedExportMap(rootTypeWhitelist, rootTypeExports)
  }
];

mismatches
  .filter((entry) => entry.values.length > 0)
  .forEach((entry) => fail(entry.message, entry.values));

if (process.exitCode !== 1) {
  console.log(`增强组件一致性校验通过，共校验 ${componentNames.length} 个增强组件。`);
}
