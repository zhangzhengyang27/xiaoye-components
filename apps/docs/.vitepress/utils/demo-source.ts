export interface DemoSourceItem {
  label: string;
  raw: string;
  rendered: string;
}

const demoSourceRegistry = new Map<string, DemoSourceItem[]>();

export function setDemoSource(path: string, sources: DemoSourceItem[]) {
  demoSourceRegistry.set(path, sources);
}

export function getDemoSource(path: string) {
  return demoSourceRegistry.get(path);
}
