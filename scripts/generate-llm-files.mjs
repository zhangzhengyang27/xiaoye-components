import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function readFile(relativePath) {
  const absolute = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return fs.readFileSync(absolute, "utf8");
}

function readManifest(relativePath) {
  const content = readFile(relativePath);
  if (!content) return [];
  return JSON.parse(content);
}

const baseManifest = readManifest("packages/components/component-manifest.json");
const proManifest = readManifest("packages/pro-components/component-manifest.json");

const TYPE_EXPANSIONS = {
  ButtonType: "'default' | 'primary' | 'success' | 'warning' | 'danger'",
  ButtonNativeType: "'button' | 'submit' | 'reset'",
  ComponentSize: "'sm' | 'md' | 'lg'",
  InputType: "'text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'",
  InputAutoSize: "{ minRows?: number; maxRows?: number } | boolean",
  InputModelModifiers: "{ lazy?: true; number?: true; trim?: true }",
  TableAlign: "'left' | 'center' | 'right'",
  TableSortOrder: "'ascending' | 'descending' | null",
  TableSortable: "boolean | 'custom'",
  TableColumnType: "'default' | 'selection' | 'index' | 'expand'",
  TableColumnFixed: "boolean | 'left' | 'right'",
  TableLayout: "'fixed' | 'auto'",
  DialogCloseReason: "'close' | 'backdrop' | 'escape' | 'programmatic'",
  DialogTransition: "string | TransitionProps",
  Placement: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end'",
  TooltipEffect: "'dark' | 'light'",
  FormTrigger: "'blur' | 'change'",
  ValidateState: "'idle' | 'validating' | 'success' | 'error'",
  SearchFormFieldBuiltinComponent: "'input' | 'select' | 'checkbox' | 'checkbox-group' | 'radio' | 'radio-button' | 'radio-group' | 'cascader' | 'date-picker' | 'time-picker' | 'time-select' | 'input-number' | 'switch' | 'transfer' | 'avatar' | 'image' | 'progress' | 'tag' | 'timeline' | 'tree' | 'steps'",
  ProTableDensity: "'sm' | 'md' | 'lg'",
  ProTableEditableMode: "'table' | 'row' | 'cell'",
  ProTableEditableTrigger: "'click' | 'dblclick' | 'manual'",
  ProTableSelectionMode: "'single' | 'multiple'",
  ProTableExportType: "'csv' | 'excel'",
  ProTableContextmenuScope: "'row' | 'cell' | 'header'",
};

function expandType(typeStr) {
  if (!typeStr) return typeStr;
  let result = typeStr;
  for (const [ref, expansion] of Object.entries(TYPE_EXPANSIONS)) {
    const patterns = [
      new RegExp(`\\b${ref}\\b`, "g"),
      new RegExp(`\\b${ref}\\s*\\[\\s*["']`, "g"),
    ];
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        result = result.replace(new RegExp(`\\b${ref}\\b`, "g"), `(${expansion})`);
      }
    }
  }
  result = result.replace(/\bXxxProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bButtonProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bInputProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bSelectProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bTableProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bFormProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bDialogProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bButtonGroupProps\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bButtonGroupDirection\b/g, "'horizontal' | 'vertical'");
  result = result.replace(/\bButtonInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bInputInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bSelectInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bTableInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bFormInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bDialogInstance\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bDialogServiceHandle\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bDialogServiceResult\["([^"]+)"\]/g, "$1");
  result = result.replace(/\bSelectValue<T>\b/g, "T | T[] | null");
  result = result.replace(/\bSelectValueChangeHandler<T>\b/g, "(value: T | T[] | null) => void");
  result = result.replace(/\bSelectVisibleChangeHandler\b/g, "(value: boolean) => void");
  result = result.replace(/\bSelectSearchChangeHandler\b/g, "(value: string) => void");
  result = result.replace(/\bButtonClickHandler\b/g, "(event: MouseEvent) => void");
  result = result.replace(/\bInputValueChangeHandler\b/g, "(value: string | number) => void");
  result = result.replace(/\bInputFocusHandler\b/g, "(event: FocusEvent) => void");
  result = result.replace(/\bDialogBeforeCloseFn\b/g, "(done: (cancel?: boolean) => void, reason?: 'close' | 'backdrop' | 'escape' | 'programmatic') => void | Promise<void>");
  result = result.replace(/\bDialogModelValueChangeHandler\b/g, "(value: boolean) => void");
  result = result.replace(/\bDialogFullscreenChangeHandler\b/g, "(value: boolean) => void");
  result = result.replace(/\bDialogResizeHandler\b/g, "(event: MouseEvent, width: number, height: number) => void");
  result = result.replace(/\bTableRowClickHandler<T>\b/g, "(row: T, column: TableResolvedColumn<T> | undefined, event: MouseEvent | KeyboardEvent) => void");
  result = result.replace(/\bTableSelectionChangeHandler<T>\b/g, "(selection: T[]) => void");
  result = result.replace(/\bTableSortChangePayload<T>\b/g, "{ column: TableResolvedColumn<T>; prop: string | undefined; order: 'ascending' | 'descending' | null }");
  result = result.replace(/\bTableFilterChangeHandler\b/g, "(value: Record<string, (string | number | boolean)[]>) => void");
  result = result.replace(/\bTableScrollPayload\b/g, "{ scrollLeft: number; scrollTop: number }");
  result = result.replace(/\bFormProp\b/g, "string | string[]");
  result = result.replace(/\bFormRules\b/g, "Record<string, XyFormRule[]>");
  result = result.replace(/\bXyFormRule\b/g, "RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }");
  result = result.replace(/\bTableTreeProps\b/g, "{ hasChildren?: string; children?: string; checkStrictly?: boolean }");
  result = result.replace(/\bTableSortState\b/g, "{ prop?: string; order?: 'ascending' | 'descending' | null }");
  result = result.replace(/\bTableOverflowTooltip\b/g, "boolean | TableOverflowTooltipOptions");
  result = result.replace(/\bTableOverflowTooltipOptions\b/g, "{ effect?: 'dark' | 'light'; enterable?: boolean; hideAfter?: number; offset?: number; placement?: Placement; popperClass?: string; showAfter?: number; showArrow?: boolean }");
  result = result.replace(/\bStyleValue\b/g, "string | CSSProperties | Array<string | CSSProperties>");
  result = result.replace(/\bTransitionProps\b/g, "TransitionProps");
  return result;
}

function parseMarkdownTable(tableText) {
  const lines = tableText.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const headerCells = splitMarkdownRow(lines[0]);
  const rows = [];

  for (let i = 2; i < lines.length; i++) {
    const cells = splitMarkdownRow(lines[i]);
    if (cells.length === 0) continue;
    const row = {};
    headerCells.forEach((header, idx) => {
      row[header.trim()] = (cells[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function splitMarkdownRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  const placeholder = "\x00PIPE\x00";
  const withPlaceholders = trimmed.replace(/\\\|/g, placeholder);
  const cells = withPlaceholders.split("|").map((cell) =>
    cell.trim().replace(new RegExp(placeholder, "g"), "|")
  );
  return cells;
}

function extractApiSection(docContent, sectionTitle) {
  const headingPattern = new RegExp(
    `^###\\s+${escapeRegExp(sectionTitle)}\\s*$`,
    "m"
  );
  const match = headingPattern.exec(docContent);
  if (!match) return null;

  const startIndex = match.index + match[0].length;
  const nextHeading = docContent.indexOf("\n### ", startIndex);
  const nextH2 = docContent.indexOf("\n## ", startIndex);
  let endIndex = docContent.length;
  if (nextHeading !== -1) endIndex = Math.min(endIndex, nextHeading);
  if (nextH2 !== -1) endIndex = Math.min(endIndex, nextH2);

  const sectionText = docContent.slice(startIndex, endIndex);
  const tableMatch = sectionText.match(/\|[\s\S]*?\|[\s\S]*?\|/);
  if (!tableMatch) return null;

  const tableLines = sectionText.split("\n").filter((line) => line.trim().startsWith("|"));
  if (tableLines.length < 2) return null;

  return parseMarkdownTable(tableLines.join("\n"));
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractComponentApi(docContent, _componentName) {
  const api = {
    props: [],
    events: [],
    slots: [],
    exposes: [],
  };

  const h3Headings = [...docContent.matchAll(/^###\s+(.+)$/gm)].map(
    (m) => m[1].trim()
  );

  const propsHeading = h3Headings.find((h) => /Attributes$/i.test(h));
  const eventsHeading = h3Headings.find((h) => /Events$/i.test(h));
  const slotsHeading = h3Headings.find((h) => /Slots$/i.test(h));
  const exposesHeading = h3Headings.find(
    (h) => /Exposes$/i.test(h) || /Methods$/i.test(h)
  );

  if (propsHeading) {
    const rows = extractApiSection(docContent, propsHeading);
    if (rows && rows.length > 0) {
      api.props = rows
        .map((row) => ({
          name: cleanMarkdown(row["属性"] || row["名称"] || ""),
          description: cleanMarkdown(row["说明"] || ""),
          type: expandType(cleanMarkdown(row["类型"] || "")),
          default: cleanMarkdown(row["默认值"] || ""),
        }))
        .filter((p) => p.name);
    }
  }

  if (eventsHeading) {
    const rows = extractApiSection(docContent, eventsHeading);
    if (rows && rows.length > 0) {
      api.events = rows
        .map((row) => ({
          name: cleanMarkdown(row["事件"] || ""),
          description: cleanMarkdown(row["说明"] || ""),
          params: expandType(cleanMarkdown(row["参数"] || "")),
        }))
        .filter((e) => e.name);
    }
  }

  if (slotsHeading) {
    const rows = extractApiSection(docContent, slotsHeading);
    if (rows && rows.length > 0) {
      api.slots = rows
        .map((row) => ({
          name: cleanMarkdown(row["插槽"] || ""),
          description: cleanMarkdown(row["说明"] || ""),
          props: cleanMarkdown(row["参数"] || ""),
        }))
        .filter((s) => s.name);
    }
  }

  if (exposesHeading) {
    const rows = extractApiSection(docContent, exposesHeading);
    if (rows && rows.length > 0) {
      api.exposes = rows
        .map((row) => ({
          name: cleanMarkdown(
            row["暴露项"] || row["名称"] || row["方法"] || ""
          ),
          description: cleanMarkdown(row["说明"] || ""),
          type: expandType(
            cleanMarkdown(row["类型"] || row["签名"] || "")
          ),
        }))
        .filter((e) => e.name);
    }
  }

  return api;
}

function cleanMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function extractDescription(docContent) {
  const lines = docContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("description:")) {
      return trimmed.replace(/^description:\s*/, "").trim();
    }
  }
  return "";
}

function processComponents(manifest, docsDir, layer) {
  const results = [];

  for (const entry of manifest) {
    const docPath = path.join(docsDir, `${entry.name}.md`);
    const docContent = readFile(docPath);
    if (!docContent) {
      results.push({
        name: entry.name,
        title: entry.docsText,
        description: "",
        tags: entry.installChecks.map((c) => c.name),
        exports: entry.installExports,
        layer,
        props: [],
        events: [],
        slots: [],
        exposes: [],
      });
      continue;
    }

    const api = extractComponentApi(docContent, entry.name);
    const description = extractDescription(docContent);

    results.push({
      name: entry.name,
      title: entry.docsText,
      description,
      tags: entry.installChecks.map((c) => c.name),
      exports: entry.installExports,
      layer,
      ...api,
    });
  }

  return results;
}

const baseComponents = processComponents(
  baseManifest,
  "apps/docs/components",
  "base"
);
const proComponents = processComponents(
  proManifest,
  "apps/docs/components",
  "pro"
);

const allComponents = [...baseComponents, ...proComponents];

const schema = {
  version: "1.0.0",
  generatedAt: new Date().toISOString(),
  components: allComponents,
};

const schemaDir = path.join(repoRoot, "scripts/.llm-cache");
if (!fs.existsSync(schemaDir)) {
  fs.mkdirSync(schemaDir, { recursive: true });
}

fs.writeFileSync(
  path.join(schemaDir, "api-schema.json"),
  JSON.stringify(schema, null, 2),
  "utf8"
);

console.log(`API Schema 已生成：${allComponents.length} 个组件`);

function generateLlmsFull(components) {
  const sections = [];

  sections.push(`# xiaoye-components 完整 API 参考`);
  sections.push(``);
  sections.push(`> 自动生成于 ${new Date().toISOString()}`);
  sections.push(`> 包含 ${components.length} 个组件的完整 Props / Events / Slots / Exposes 定义`);
  sections.push(``);

  const grouped = {
    base: { basic: [], form: [], feedback: [], data: [] },
    pro: { form: [], data: [], detail: [], page: [], workflow: [] },
  };

  for (const comp of components) {
    const manifest = comp.layer === "base" ? baseManifest : proManifest;
    const entry = manifest.find((e) => e.name === comp.name);
    const docsGroup = entry?.docsGroup || "basic";
    if (grouped[comp.layer] && grouped[comp.layer][docsGroup]) {
      grouped[comp.layer][docsGroup].push(comp);
    }
  }

  const groupLabels = {
    basic: "基础与展示",
    form: "表单输入",
    feedback: "反馈与浮层",
    data: "数据展示",
    detail: "详情",
    page: "页面容器",
    workflow: "工作流",
  };

  sections.push(`## 基础组件（@xiaoye/components）`);
  sections.push(``);

  for (const [groupKey, label] of Object.entries(groupLabels)) {
    const comps = grouped.base[groupKey];
    if (!comps || comps.length === 0) continue;

    sections.push(`### ${label}`);
    sections.push(``);

    for (const comp of comps) {
      sections.push(renderComponent(comp));
    }
  }

  sections.push(`## 增强组件（@xiaoye/pro-components）`);
  sections.push(``);

  for (const [groupKey, label] of Object.entries(groupLabels)) {
    const comps = grouped.pro[groupKey];
    if (!comps || comps.length === 0) continue;

    sections.push(`### ${label}`);
    sections.push(``);

    for (const comp of comps) {
      sections.push(renderComponent(comp));
    }
  }

  return sections.join("\n");
}

function escapeTableCell(text) {
  return String(text).replace(/\|/g, "\\|");
}

function renderComponent(comp) {
  const lines = [];
  const tag = comp.tags[0] || comp.name;

  lines.push(`#### ${comp.title}`);
  if (comp.description) {
    lines.push(``);
    lines.push(comp.description);
  }
  lines.push(``);
  lines.push(`标签：\`${tag}\` 导出：\`${comp.exports.join("`, `")}\``);
  lines.push(``);

  if (comp.props.length > 0) {
    lines.push(`**Props**`);
    lines.push(``);
    lines.push(`| 属性 | 类型 | 默认值 | 说明 |`);
    lines.push(`|------|------|--------|------|`);
    for (const prop of comp.props) {
      const type = prop.type || "-";
      const defaultVal = escapeTableCell(prop.default || "-");
      const desc = escapeTableCell(prop.description || "");
      lines.push(`| \`${prop.name}\` | \`${type}\` | ${defaultVal} | ${desc} |`);
    }
    lines.push(``);
  }

  if (comp.events.length > 0) {
    lines.push(`**Events**`);
    lines.push(``);
    lines.push(`| 事件 | 参数 | 说明 |`);
    lines.push(`|------|------|------|`);
    for (const event of comp.events) {
      const params = event.params || "-";
      const desc = escapeTableCell(event.description || "");
      lines.push(`| \`${event.name}\` | \`${params}\` | ${desc} |`);
    }
    lines.push(``);
  }

  if (comp.slots.length > 0) {
    lines.push(`**Slots**`);
    lines.push(``);
    lines.push(`| 插槽 | 说明 |`);
    lines.push(`|------|------|`);
    for (const slot of comp.slots) {
      const desc = escapeTableCell(slot.description || "");
      const propsInfo = slot.props ? `（接收 ${escapeTableCell(slot.props)}）` : "";
      lines.push(`| \`${slot.name}\` | ${desc}${propsInfo} |`);
    }
    lines.push(``);
  }

  if (comp.exposes.length > 0) {
    lines.push(`**Exposes**`);
    lines.push(``);
    lines.push(`| 名称 | 类型 | 说明 |`);
    lines.push(`|------|------|------|`);
    for (const expose of comp.exposes) {
      const type = expose.type || "-";
      const desc = escapeTableCell(expose.description || "");
      lines.push(`| \`${expose.name}\` | \`${type}\` | ${desc} |`);
    }
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);

  return lines.join("\n");
}

const llmsFullContent = generateLlmsFull(allComponents);
fs.writeFileSync(
  path.join(repoRoot, "llms-full.txt"),
  llmsFullContent,
  "utf8"
);

console.log(`llms-full.txt 已生成`);
console.log(`基础组件：${baseComponents.length} 个`);
console.log(`增强组件：${proComponents.length} 个`);

const withApi = allComponents.filter(
  (c) => c.props.length > 0 || c.events.length > 0 || c.slots.length > 0
);
const withoutApi = allComponents.filter(
  (c) => c.props.length === 0 && c.events.length === 0 && c.slots.length === 0
);
console.log(`有 API 数据：${withApi.length} 个`);
console.log(`无 API 数据：${withoutApi.length} 个`);
if (withoutApi.length > 0) {
  console.log(
    `缺少 API 的组件：${withoutApi.map((c) => c.name).join(", ")}`
  );
}
