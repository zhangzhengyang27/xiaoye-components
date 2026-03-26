import type { App, AppContext } from "vue";

export type SFCWithInstall<T> = T & {
  install(app: App): void;
};

export type FunctionWithInstall<T> = T & {
  install(app: App): void;
  _context?: AppContext | null;
};

type AnyFunction = (...args: any[]) => any;

function toKebabCase(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export function withInstall<T>(component: T, name: string) {
  const installable = component as SFCWithInstall<T>;

  installable.install = (app: App) => {
    const aliases = Array.from(new Set([name, toKebabCase(name)]));

    aliases.forEach((alias) => {
      if (!app.component(alias)) {
        app.component(alias, installable as never);
      }
    });
  };

  return installable;
}

export function withInstallFunction<T extends AnyFunction>(fn: T, property: string) {
  const installable = fn as FunctionWithInstall<T> & Record<string, unknown>;

  installable.install = (app: App) => {
    installable._context = app._context;
    const bound = ((...args: Parameters<T>) => installable(...args, app._context)) as T;
    const boundRecord = bound as unknown as Record<string, unknown> & {
        _context?: AppContext | null;
      };

    Object.entries(installable).forEach(([key, value]) => {
      if (key === "install" || key === "_context") {
        return;
      }

      if (
        typeof value === "function" &&
        ["primary", "success", "info", "warning", "error"].includes(key)
      ) {
        boundRecord[key] = (...args: unknown[]) => (value as AnyFunction)(...args, app._context);
        return;
      }

      if (typeof value === "function" && key === "withContext") {
        boundRecord[key] = (appContext?: AppContext | null) =>
          (value as AnyFunction)(appContext ?? app._context);
        return;
      }

      boundRecord[key] = value;
    });

    boundRecord._context = app._context;
    app.config.globalProperties[property] = bound as never;
  };

  installable._context = null;

  return installable as FunctionWithInstall<T>;
}
