export type FormProp = string | string[];

export function normalizeFormProp(prop?: FormProp) {
  if (!prop) {
    return "";
  }

  return Array.isArray(prop) ? prop.join(".") : prop;
}

export function toPathSegments(prop?: FormProp) {
  if (!prop) {
    return [];
  }

  if (Array.isArray(prop)) {
    return prop.map((segment) => `${segment}`);
  }

  return prop
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function getPathValue(source: Record<string, unknown>, prop?: FormProp) {
  const segments = toPathSegments(prop);

  if (!segments.length) {
    return undefined;
  }

  return segments.reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);
}

export function setPathValue(source: Record<string, unknown>, prop: FormProp, value: unknown) {
  const segments = toPathSegments(prop);

  if (!segments.length) {
    return;
  }

  let current: Record<string, unknown> = source;

  segments.slice(0, -1).forEach((key) => {
    const nextValue = current[key];

    if (nextValue == null || typeof nextValue !== "object") {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  });

  current[segments[segments.length - 1] as string] = value;
}
