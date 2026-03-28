import manifestJson from "./component-manifest.json" with { type: "json" };

export type ComponentDocsGroup = "basic" | "form" | "feedback" | "data";

interface RawComponentInstallCheck {
  kind: "component" | "directive" | "globalProperty";
  name: string;
}

interface RawComponentManifestEntry {
  name: string;
  docsGroup: ComponentDocsGroup;
  docsText: string;
  installExports: string[];
  installChecks: RawComponentInstallCheck[];
  styleImports: string[];
}

export interface ComponentManifestEntry {
  name: string;
  docsGroup: ComponentDocsGroup;
  docsText: string;
  installExports: string[];
  installChecks: RawComponentInstallCheck[];
  install: {
    components: string[];
    directives: string[];
    globals: string[];
  };
  styleImports: string[];
}

const rawManifest = manifestJson as RawComponentManifestEntry[];

const docsGroupTextMap: Record<ComponentDocsGroup, string> = {
  basic: "基础组件",
  form: "表单与录入",
  feedback: "反馈与浮层",
  data: "数据展示"
};

const docsGroupOrder: ComponentDocsGroup[] = ["basic", "form", "feedback", "data"];

export const componentManifest = rawManifest.map((entry) => ({
  ...entry,
  install: {
    components: entry.installChecks
      .filter((check) => check.kind === "component")
      .map((check) => check.name),
    directives: entry.installChecks
      .filter((check) => check.kind === "directive")
      .map((check) => check.name),
    globals: entry.installChecks
      .filter((check) => check.kind === "globalProperty")
      .map((check) => check.name)
  }
})) satisfies ComponentManifestEntry[];

export const publicComponentNames = componentManifest.map((entry) => entry.name);

export const installableComponentExportNames = componentManifest.flatMap(
  (entry) => entry.installExports
);

export const installCheckEntries = componentManifest.flatMap((entry) => entry.installChecks);

export const themeStyleImportNames = Array.from(
  new Set(componentManifest.flatMap((entry) => entry.styleImports))
);

export const componentStyleImports = themeStyleImportNames;

export const componentDocsSidebarGroups = docsGroupOrder.map((group) => ({
  text: docsGroupTextMap[group],
  items: componentManifest
    .filter((entry) => entry.docsGroup === group)
    .map((entry) => ({
      text: entry.docsText,
      link: `/components/${entry.name}`
    }))
}));
