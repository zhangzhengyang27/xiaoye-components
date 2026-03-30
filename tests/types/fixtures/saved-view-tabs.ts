import type { SavedViewTabItem, SavedViewTabsProps } from "@xiaoye/pro-components";

const items: SavedViewTabItem[] = [
  {
    key: "all",
    label: "全部"
  },
  {
    key: "done",
    label: "已完成",
    count: 2,
    closable: true
  }
];

const props: SavedViewTabsProps = {
  items,
  activeKey: "all",
  addable: true
};

void items;
void props;
