const warnedMessages = new Set<string>();

export function isDev() {
  const env = (import.meta as ImportMeta & {
    env?: {
      DEV?: boolean;
      MODE?: string;
      PROD?: boolean;
    };
  }).env;

  if (typeof process !== "undefined" && process.env.VITEST === "true") {
    return true;
  }

  if (env?.MODE === "test") {
    return true;
  }

  if (typeof env?.DEV === "boolean") {
    return env.DEV;
  }

  return env?.PROD !== true;
}

export function warnOnce(scope: string, message: string) {
  if (!isDev()) {
    return;
  }

  const key = `${scope}:${message}`;

  if (warnedMessages.has(key)) {
    return;
  }

  warnedMessages.add(key);
  console.warn(`[${scope}] ${message}`);
}

export interface DeprecationOptions {
  /** 组件名称，如 'XyButton' */
  component: string;
  /** 废弃的属性或 API */
  deprecated: string;
  /** 替代方案，如 'variant' */
  replacement: string;
  /** 废弃的版本 */
  version?: string;
  /** 额外说明 */
  description?: string;
}

/**
 * 发出废弃警告
 * 在开发环境下警告一次，不影响功能
 */
export function deprecated(options: DeprecationOptions) {
  const { component, deprecated: deprecatedApi, replacement, version, description } = options;
  const versionInfo = version ? ` (废弃于 v${version})` : "";
  const descriptionInfo = description ? ` - ${description}` : "";

  warnOnce(
    component,
    `"${deprecatedApi}" 已被废弃${versionInfo}，请使用 "${replacement}" 替代。${descriptionInfo}`
  );
}

/**
 * Props 废弃检查
 * 在组件的 setup 中调用，自动检测并警告废弃的 props
 */
export function useDeprecatedProps<T extends Record<string, unknown>>(
  component: string,
  props: T,
  deprecatedProps: Record<string, string>
) {
  const currentValues: Record<string, unknown> = {};

  for (const [deprecatedKey, replacementKey] of Object.entries(deprecatedProps)) {
    if (deprecatedKey in props && props[deprecatedKey] !== undefined) {
      currentValues[deprecatedKey] = props[deprecatedKey];
      deprecated({
        component,
        deprecated: deprecatedKey,
        replacement: replacementKey
      });
    }
  }

  return currentValues;
}
