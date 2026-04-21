import { Fragment, h, type VNodeChild } from "vue";
import type { SelectOptionGroup } from "../select";
import type { SelectOption } from "@xiaoye/primitives";
import { displayComponentMap } from "./display-component-map";
import {
  flattenDisplayOptions,
  formatDisplayDate,
  formatDisplayMoney,
  getDisplayOptionValues,
  isDisplayValueEmpty,
  resolveDisplayEmptyValue,
  stringifyDisplayValue,
  type DisplayOptionLike
} from "./display-value-type";

type DisplayContext<TRow, TColumn> = {
  row: TRow;
  column: TColumn;
  rowIndex: number;
};

type DisplayColumnLike<TRow, TColumn> = {
  valueType?: string;
  options?:
    | Array<SelectOption | SelectOptionGroup>
    | ((row: TRow) => Array<SelectOption | SelectOptionGroup>);
  formatter?: (row: TRow, column: any, value: unknown, rowIndex: number) => unknown;
  render?: (value: unknown, context: DisplayContext<TRow, TColumn>) => VNodeChild;
  renderHTML?: (value: unknown, context: DisplayContext<TRow, TColumn>) => string;
  emptyValue?: string;
};

type ResolvedOption = DisplayOptionLike;

function hasDisplayStatus(option: ResolvedOption) {
  return Boolean(option.status || option.color);
}

function resolveColumnOptions<TRow>(
  options:
    | Array<SelectOption | SelectOptionGroup>
    | ((row: TRow) => Array<SelectOption | SelectOptionGroup>)
    | undefined,
  row: TRow
) {
  if (!options) {
    return [];
  }

  return flattenDisplayOptions(
    typeof options === "function" ? options(row) : options
  );
}

function resolveMatchedOptions<TRow>(
  value: unknown,
  options:
    | Array<SelectOption | SelectOptionGroup>
    | ((row: TRow) => Array<SelectOption | SelectOptionGroup>)
    | undefined,
  row: TRow
) {
  const flatOptions = resolveColumnOptions(options, row);
  const values = getDisplayOptionValues(value);

  return values
    .map((item) =>
      flatOptions.find((option) => Object.is(option.value, item))
    )
    .filter(Boolean) as ResolvedOption[];
}

function renderEmptyValue(emptyValue?: string) {
  return h(
    "span",
    { class: "xy-display-value__empty" },
    resolveDisplayEmptyValue(emptyValue)
  );
}

function resolveFormattedText<TRow, TColumn>(
  value: unknown,
  column: DisplayColumnLike<TRow, TColumn>,
  context: DisplayContext<TRow, TColumn>
) {
  const formatted = column.formatter?.(
    context.row,
    context.column,
    value,
    context.rowIndex
  );
  return formatted == null
    ? resolveDisplayEmptyValue(column.emptyValue)
    : stringifyDisplayValue(formatted, column.emptyValue);
}

function renderOptionDisplay<TRow, TColumn>(
  value: unknown,
  column: DisplayColumnLike<TRow, TColumn>,
  context: DisplayContext<TRow, TColumn>,
  mode: "text" | "tag"
) {
  if (isDisplayValueEmpty(value)) {
    return renderEmptyValue(column.emptyValue);
  }

  const matchedOptions = resolveMatchedOptions(value, column.options, context.row);

  if (matchedOptions.length === 0) {
    const text = column.formatter
      ? resolveFormattedText(value, column, context)
      : stringifyDisplayValue(value, column.emptyValue);

    return mode === "tag"
      ? h(displayComponentMap.tag, null, () => text)
      : h("span", { class: "xy-display-value__text" }, text);
  }

  if (column.formatter) {
    const text = resolveFormattedText(value, column, context);
    return mode === "tag"
      ? h(displayComponentMap.tag, null, () => text)
      : h("span", { class: "xy-display-value__text" }, text);
  }

  if (mode === "text") {
    if (matchedOptions.some(hasDisplayStatus)) {
      return h(
        "span",
        { class: "xy-display-value__status-group" },
        matchedOptions.map((option) =>
          h("span", { class: "xy-display-value__status-item" }, [
            h("i", {
              class: [
                "xy-display-value__status-dot",
                option.status ? `is-${option.status}` : ""
              ],
              style: option.color
                ? {
                    backgroundColor: option.color
                  }
                : undefined
            }),
            h("span", { class: "xy-display-value__text" }, option.label)
          ])
        )
      );
    }

    return h(
      "span",
      { class: "xy-display-value__text" },
      matchedOptions.map((option) => option.label).join(" / ")
    );
  }

  return h(
    "span",
    { class: "xy-display-value__tag-group" },
    matchedOptions.map((option) =>
      h(
        displayComponentMap.tag as any,
        option.status ? { status: option.status } : undefined,
        () => option.label
      )
    )
  );
}

export function renderDisplayValue<TRow, TColumn extends DisplayColumnLike<TRow, TColumn>>({
  value,
  row,
  rowIndex,
  column
}: {
  value: unknown;
  row: TRow;
  rowIndex: number;
  column: TColumn;
}) {
  const context: DisplayContext<TRow, TColumn> = {
    row,
    rowIndex,
    column
  };

  if (column.render) {
    return column.render(value, context);
  }

  if (column.renderHTML) {
    return h("span", {
      class: "xy-display-value__html",
      innerHTML: column.renderHTML(value, context)
    });
  }

  switch (column.valueType) {
    case "select":
    case "radio":
    case "checkbox":
      return renderOptionDisplay(value, column, context, "text");
    case "tag":
      return renderOptionDisplay(value, column, context, "tag");
    case "progress": {
      if (isDisplayValueEmpty(value)) {
        return renderEmptyValue(column.emptyValue);
      }

      const percentage = typeof value === "number" ? value : Number(value);

      if (Number.isNaN(percentage)) {
        return h(
          "span",
          { class: "xy-display-value__text" },
          column.formatter
            ? resolveFormattedText(value, column, context)
            : stringifyDisplayValue(value, column.emptyValue)
        );
      }

      return h("span", { class: "xy-display-value__progress" }, [
        h(displayComponentMap.progress, {
          percentage,
          showText: true,
          format: column.formatter
            ? () => resolveFormattedText(value, column, context)
            : undefined
        })
      ]);
    }
    case "link": {
      if (isDisplayValueEmpty(value)) {
        return renderEmptyValue(column.emptyValue);
      }

      const href = String(value);
      const text = column.formatter
        ? resolveFormattedText(value, column, context)
        : href;

      return h(
        displayComponentMap.link,
        {
          href,
          target: "_blank",
          underline: "hover"
        },
        () => text
      );
    }
    case "avatar":
      return isDisplayValueEmpty(value)
        ? renderEmptyValue(column.emptyValue)
        : h(displayComponentMap.avatar, {
            src: String(value),
            size: 32,
            alt: column.formatter
              ? resolveFormattedText(value, column, context)
              : stringifyDisplayValue(value, column.emptyValue)
          });
    case "image":
      return isDisplayValueEmpty(value)
        ? renderEmptyValue(column.emptyValue)
        : h("span", { class: "xy-display-value__image" }, [
            h(displayComponentMap.image, {
              src: String(value),
              fit: "cover"
            })
          ]);
    case "money":
      return h(
        "span",
        { class: "xy-display-value__text" },
        column.formatter
          ? resolveFormattedText(value, column, context)
          : formatDisplayMoney(value, column.emptyValue)
      );
    case "date":
      return h(
        "span",
        { class: "xy-display-value__text" },
        column.formatter
          ? resolveFormattedText(value, column, context)
          : formatDisplayDate(
              value,
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              },
              column.emptyValue
            )
      );
    case "datetime":
      return h(
        "span",
        { class: "xy-display-value__text" },
        column.formatter
          ? resolveFormattedText(value, column, context)
          : formatDisplayDate(
              value,
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              },
              column.emptyValue
            )
      );
    case "code":
      return h(
        "code",
        { class: "xy-display-value__code" },
        column.formatter
          ? resolveFormattedText(value, column, context)
          : stringifyDisplayValue(value, column.emptyValue)
      );
    case "copy":
      if (isDisplayValueEmpty(value)) {
        return renderEmptyValue(column.emptyValue);
      }

      return h(
        displayComponentMap.text,
        {
          copyable: true
        },
        () =>
          column.formatter
            ? resolveFormattedText(value, column, context)
            : stringifyDisplayValue(value, column.emptyValue)
      );
    default:
      return h(
        Fragment,
        null,
        isDisplayValueEmpty(value)
          ? [renderEmptyValue(column.emptyValue)]
          : [
              h(
                "span",
                { class: "xy-display-value__text" },
                column.formatter
                  ? resolveFormattedText(value, column, context)
                  : stringifyDisplayValue(value, column.emptyValue)
              )
            ]
      );
  }
}
