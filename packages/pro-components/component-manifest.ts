import manifestJson from "./component-manifest.json" with { type: "json" };

export type ProComponentDocsGroup = "form" | "data" | "detail" | "page" | "workflow";

interface RawComponentInstallCheck {
  kind: "component" | "directive" | "globalProperty";
  name: string;
}

interface RawProComponentManifestEntry {
  name: string;
  docsGroup: ProComponentDocsGroup;
  docsText: string;
  installExports: string[];
  installChecks: RawComponentInstallCheck[];
  styleImports: string[];
}

export interface ProComponentManifestEntry {
  name: string;
  docsGroup: ProComponentDocsGroup;
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

const rawManifest = manifestJson as RawProComponentManifestEntry[];

const docsGroupTextMap: Record<ProComponentDocsGroup, string> = {
  form: "增强表单",
  data: "增强数据",
  detail: "增强详情",
  page: "增强页面",
  workflow: "增强流程"
};

const docsGroupOrder: ProComponentDocsGroup[] = ["form", "data", "detail", "page", "workflow"];

export const proComponentManifest = rawManifest.map((entry) => ({
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
})) satisfies ProComponentManifestEntry[];

export const proPublicComponentNames = proComponentManifest.map((entry) => entry.name);

export const proInstallableComponentExportNames = proComponentManifest.flatMap(
  (entry) => entry.installExports
);

export const proInstallCheckEntries = proComponentManifest.flatMap((entry) => entry.installChecks);

export const proThemeStyleImportNames = Array.from(
  new Set(proComponentManifest.flatMap((entry) => entry.styleImports))
);

export const proComponentDocsSidebarGroups = docsGroupOrder.map((group) => ({
  text: docsGroupTextMap[group],
  items: proComponentManifest
    .filter((entry) => entry.docsGroup === group)
    .map((entry) => ({
      text: entry.docsText,
      link: `/pro-components/${entry.name}`
    }))
}));

export const proComponentExampleSidebarGroups = docsGroupOrder.map((group) => ({
  text: docsGroupTextMap[group],
  items: proComponentManifest
    .filter((entry) => entry.docsGroup === group)
    .map((entry) => ({
      text: entry.docsText,
      link: `/examples/pro/${entry.name}`
    }))
}));
