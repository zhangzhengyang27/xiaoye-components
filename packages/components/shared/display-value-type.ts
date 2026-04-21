import type { SelectOptionGroup } from "../select";
import type { ComponentStatus, SelectOption } from "@xiaoye/primitives";

export type DisplayOptionLike = SelectOption & {
  status?: ComponentStatus | "info";
  color?: string;
};

export function resolveDisplayEmptyValue(emptyValue?: string) {
  return emptyValue ?? "-";
}

export function isDisplayValueEmpty(value: unknown) {
  return (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function stringifyDisplayValue(value: unknown, emptyValue?: string) {
  const fallback = resolveDisplayEmptyValue(emptyValue);

  if (isDisplayValueEmpty(value)) {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

export function formatDisplayDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions,
  emptyValue?: string
) {
  if (isDisplayValueEmpty(value)) {
    return resolveDisplayEmptyValue(emptyValue);
  }

  const date =
    value instanceof Date
      ? value
      : new Date(typeof value === "number" ? value : String(value));

  if (Number.isNaN(date.getTime())) {
    return stringifyDisplayValue(value, emptyValue);
  }

  return new Intl.DateTimeFormat("zh-CN", options).format(date);
}

export function formatDisplayMoney(value: unknown, emptyValue?: string) {
  if (isDisplayValueEmpty(value)) {
    return resolveDisplayEmptyValue(emptyValue);
  }

  const amount = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(amount)) {
    return stringifyDisplayValue(value, emptyValue);
  }

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function flattenDisplayOptions(
  options?: Array<SelectOption | SelectOptionGroup>
) {
  if (!options?.length) {
    return [];
  }

  return options.flatMap((option) =>
    "options" in option ? option.options : [option]
  ) as DisplayOptionLike[];
}

export function getDisplayOptionValues(value: unknown) {
  return Array.isArray(value) ? value : [value];
}

