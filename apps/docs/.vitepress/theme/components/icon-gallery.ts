import mdiCollection from "@iconify-json/mdi/icons.json";
import mdiMetadata from "@iconify-json/mdi/metadata.json";

export interface MdiCollectionResponse {
  prefix: string;
  total: number;
  categories?: Record<string, string[]>;
  uncategorized?: string[];
}

export interface MdiIconDataResponse {
  prefix: string;
  icons: Record<string, { body: string; width?: number; height?: number }>;
  aliases?: Record<string, unknown>;
  chars?: Record<string, string>;
  width?: number;
  height?: number;
}

export interface MdiIconItem {
  icon: string;
  name: string;
  label: string;
  category: string;
  searchText: string;
}

export interface MdiCategoryEntry {
  name: string;
  count: number;
}

export type ProjectIconCopyMode = "name" | "component";

export const MDI_PAGE_SIZE = 120;
export const MDI_CATEGORY_CHIP_LIMIT = 12;
export const MDI_HOT_CATEGORIES = [
  "Account / User",
  "Files / Folders",
  "Arrow",
  "Navigation",
  "Alert / Error",
  "Settings",
  "Edit / Modify",
  "Text / Content / Format",
  "Brand / Logo",
  "Date / Time",
  "Lock",
  "Cellphone / Phone",
  "Weather"
] as const;

const DEFAULT_CATEGORY = "未分类";
const mdiCategories = mdiMetadata.categories ?? {};
const categorizedIconNames = new Set(Object.values(mdiCategories).flat());
const uncategorizedIconNames = Object.keys(mdiCollection.icons).filter(
  (name) => !categorizedIconNames.has(name)
);
const localMdiCollection: MdiCollectionResponse = {
  prefix: mdiCollection.prefix,
  total: Object.keys(mdiCollection.icons).length,
  categories: mdiCategories,
  uncategorized: uncategorizedIconNames
};
const normalizeSearchText = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export async function fetchMdiCollection() {
  return localMdiCollection;
}

export async function fetchMdiIconData(names: string[]) {
  const requestedNames = new Set(names.map((name) => name.replace(/^mdi:/, "")));
  const icons = Object.fromEntries(
    Object.entries(mdiCollection.icons).filter(([name]) => requestedNames.has(name))
  );
  const aliases = Object.fromEntries(
    Object.entries(mdiCollection.aliases ?? {}).filter(([name]) => requestedNames.has(name))
  );

  return {
    prefix: mdiCollection.prefix,
    icons,
    aliases: Object.keys(aliases).length > 0 ? aliases : undefined,
    width: mdiCollection.width,
    height: mdiCollection.height
  };
}

export function formatProjectIconLabel(icon: string) {
  return titleCase(icon.replace(/^mdi:/, ""));
}

export function flattenMdiIcons(collection: MdiCollectionResponse): MdiIconItem[] {
  const orderedNames: string[] = [];
  const orderedSet = new Set<string>();
  const categories = collection.categories ?? {};
  const items = new Map<string, MdiIconItem>();

  Object.entries(categories).forEach(([category, iconNames]) => {
    iconNames.forEach((name) => {
      if (!orderedSet.has(name)) {
        orderedSet.add(name);
        orderedNames.push(name);
      }

      if (items.has(name)) {
        return;
      }

      const icon = `mdi:${name}`;
      const compact = name.replace(/-/g, "");
      const label = formatProjectIconLabel(icon);

      items.set(name, {
        icon,
        name,
        label,
        category,
        searchText: [icon, name, compact, name.replace(/-/g, " "), label].join(" ").toLowerCase()
      });
    });
  });

  (collection.uncategorized ?? []).forEach((name) => {
    if (!orderedSet.has(name)) {
      orderedSet.add(name);
      orderedNames.push(name);
    }

    if (items.has(name)) {
      return;
    }

    const icon = `mdi:${name}`;
    const compact = name.replace(/-/g, "");
    const label = formatProjectIconLabel(icon);

    items.set(name, {
      icon,
      name,
      label,
      category: DEFAULT_CATEGORY,
      searchText: [icon, name, compact, name.replace(/-/g, " "), label].join(" ").toLowerCase()
    });
  });

  return orderedNames
    .map((name) => items.get(name))
    .filter((item): item is MdiIconItem => Boolean(item));
}

export function getMdiCategoryOptions(items: MdiIconItem[]) {
  const categories = new Set<string>();

  items.forEach((item) => {
    categories.add(item.category);
  });

  return ["全部", ...Array.from(categories)];
}

export function buildMdiCategoryEntries(items: MdiIconItem[], query = ""): MdiCategoryEntry[] {
  const matchedItems = filterProjectIcons(items, query, "全部");
  const counts = new Map<string, number>();
  const hotCategorySet = new Set<string>(MDI_HOT_CATEGORIES);

  counts.set("全部", matchedItems.length);

  matchedItems.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  });

  const categories = Array.from(counts.entries())
    .filter(([name]) => name !== "全部")
    .sort((left, right) => {
      const leftHotIndex = MDI_HOT_CATEGORIES.indexOf(left[0] as (typeof MDI_HOT_CATEGORIES)[number]);
      const rightHotIndex = MDI_HOT_CATEGORIES.indexOf(right[0] as (typeof MDI_HOT_CATEGORIES)[number]);
      const leftIsHot = hotCategorySet.has(left[0]);
      const rightIsHot = hotCategorySet.has(right[0]);

      if (leftIsHot && rightIsHot) {
        return leftHotIndex - rightHotIndex;
      }

      if (leftIsHot) {
        return -1;
      }

      if (rightIsHot) {
        return 1;
      }

      if (left[0] === DEFAULT_CATEGORY) {
        return 1;
      }

      if (right[0] === DEFAULT_CATEGORY) {
        return -1;
      }

      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([name, count]) => ({
      name,
      count
    }));

  return [
    {
      name: "全部",
      count: matchedItems.length
    },
    ...categories
  ];
}

export function filterProjectIcons(items: MdiIconItem[], query: string, category = "全部") {
  const keyword = normalizeSearchText(query);
  const byCategory = category === "全部" ? items : items.filter((item) => item.category === category);

  if (!keyword) {
    return byCategory;
  }

  return byCategory.filter((item) => normalizeSearchText(item.searchText).includes(keyword));
}

export function paginateIcons<T>(items: T[], page: number, pageSize = MDI_PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

export function getPageCount(total: number, pageSize = MDI_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function createProjectIconCopyText(icon: string, mode: ProjectIconCopyMode) {
  if (mode === "name") {
    return icon;
  }

  return `<xy-icon icon="${icon}" />`;
}
