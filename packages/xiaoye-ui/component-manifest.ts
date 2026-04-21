import manifestJson from "./component-manifest.json" with { type: "json" };

interface RawUIManifestEntry {
  name: string;
  docsText: string;
  installExports: string[];
  styleImports: string[];
}

interface UIManifestEntry {
  name: string;
  docsText: string;
  installExports: string[];
  styleImports: string[];
}

const rawManifest = manifestJson as RawUIManifestEntry[];

export const uiManifest = rawManifest satisfies UIManifestEntry[];

export const uiComponentNames = uiManifest.map((entry) => entry.name);

export const uiComponentDocsSidebarGroups = [
  {
    text: "前台专属组件",
    items: uiManifest.map((entry) => ({
      text: entry.docsText,
      link: `/front/${entry.name}`
    }))
  },
  {
    text: "Headless 组合 API",
    items: [
      {
        text: "Headless 组合 API 概览",
        link: "/front/headless"
      }
    ]
  }
];
