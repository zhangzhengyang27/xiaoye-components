import type { App } from "vue";

export type SFCWithInstall<T> = T & {
  install(app: App): void;
};

function toKebabCase(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export function withInstall<T>(component: T, name: string) {
  const installable = component as SFCWithInstall<T>;

  installable.install = (app: App) => {
    app.component(name, installable as never);
    app.component(toKebabCase(name), installable as never);
  };

  return installable;
}
