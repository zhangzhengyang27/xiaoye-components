import type {
  CollapseActiveName,
  CollapseBeforeCollapse,
  CollapseExpandIconPosition,
  CollapseItemProps,
  CollapseModelValue,
  CollapseProps
} from "xiaoye-components";

const singleName: CollapseActiveName = "intro";
const multipleNames: CollapseModelValue = ["intro", 2];
const iconPosition: CollapseExpandIconPosition = "left";
const beforeCollapse: CollapseBeforeCollapse = async (_name) => true;

const collapseProps: CollapseProps = {
  modelValue: multipleNames,
  accordion: false,
  expandIconPosition: iconPosition,
  beforeCollapse
};

const collapseItemProps: CollapseItemProps = {
  title: "基础说明",
  name: singleName,
  disabled: false
};

void collapseProps;
void collapseItemProps;

const invalidCollapseProps: CollapseProps = {
  // @ts-expect-error invalid expand icon position
  expandIconPosition: "top"
};

void invalidCollapseProps;
