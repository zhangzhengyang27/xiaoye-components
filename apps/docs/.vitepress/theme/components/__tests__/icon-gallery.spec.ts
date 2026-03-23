import { describe, expect, it } from "vitest";
import {
  buildMdiCategoryEntries,
  createProjectIconCopyText,
  filterProjectIcons,
  flattenMdiIcons,
  formatProjectIconLabel,
  getMdiCategoryOptions,
  getPageCount,
  paginateIcons
} from "../icon-gallery";

describe("icon gallery helpers", () => {
  it("会把集合元数据扁平化为图标列表", () => {
    const items = flattenMdiIcons({
      prefix: "mdi",
      total: 4,
      categories: {
        System: ["account", "account-alert"],
        Action: ["home"]
      },
      uncategorized: ["zodiac-aquarius"]
    });

    expect(items.map((item) => item.icon)).toEqual([
      "mdi:account",
      "mdi:account-alert",
      "mdi:home",
      "mdi:zodiac-aquarius"
    ]);
    expect(items[0].category).toBe("System");
    expect(items[3].category).toBe("未分类");
  });

  it("会把 icon 标识格式化成可读标题", () => {
    expect(formatProjectIconLabel("mdi:file-document-outline")).toBe("File Document Outline");
  });

  it("支持按 icon 值、语义词和分类搜索", () => {
    const items = flattenMdiIcons({
      prefix: "mdi",
      total: 2,
      categories: {
        Document: ["file-document-outline"],
        Action: ["open-in-new"]
      },
      uncategorized: []
    });

    expect(filterProjectIcons(items, "document")).toHaveLength(1);
    expect(filterProjectIcons(items, "mdiopen")).toHaveLength(1);
    expect(filterProjectIcons(items, "", "Document")).toHaveLength(1);
  });

  it("支持生成复制内容", () => {
    expect(createProjectIconCopyText("mdi:magnify", "name")).toBe("mdi:magnify");
    expect(createProjectIconCopyText("mdi:magnify", "component")).toBe(
      '<xy-icon icon="mdi:magnify" />'
    );
  });

  it("支持生成分类选项与分页切片", () => {
    const items = flattenMdiIcons({
      prefix: "mdi",
      total: 3,
      categories: {
        Action: ["open-in-new", "plus"],
        Brand: ["vuejs"]
      },
      uncategorized: []
    });

    expect(getMdiCategoryOptions(items)).toEqual(["全部", "Action", "Brand"]);
    expect(buildMdiCategoryEntries(items)).toEqual([
      { name: "全部", count: 3 },
      { name: "Action", count: 2 },
      { name: "Brand", count: 1 }
    ]);
    expect(getPageCount(241, 120)).toBe(3);
    expect(paginateIcons(items, 1, 2).map((item) => item.icon)).toEqual([
      "mdi:open-in-new",
      "mdi:plus"
    ]);
  });

  it("会去重重复分类图标，并按热门分类和搜索结果生成标签", () => {
    const items = flattenMdiIcons({
      prefix: "mdi",
      total: 4,
      categories: {
        "Files / Folders": ["folder", "file"],
        "Account / User": ["account", "folder"],
        Misc: ["star"]
      },
      uncategorized: []
    });

    expect(items.map((item) => item.icon)).toEqual([
      "mdi:folder",
      "mdi:file",
      "mdi:account",
      "mdi:star"
    ]);

    expect(buildMdiCategoryEntries(items)).toEqual([
      { name: "全部", count: 4 },
      { name: "Account / User", count: 1 },
      { name: "Files / Folders", count: 2 },
      { name: "Misc", count: 1 }
    ]);

    expect(buildMdiCategoryEntries(items, "file")).toEqual([
      { name: "全部", count: 1 },
      { name: "Files / Folders", count: 1 }
    ]);
  });
});
