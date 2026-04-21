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
