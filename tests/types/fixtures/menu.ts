import { h } from "vue";
import {
  XyMenu,
  XyMenuItem,
  XyMenuItemGroup,
  XySubMenu,
  type MenuDataItem,
  type MenuItemClicked,
  type MenuItemGroupProps,
  type MenuItemProps,
  type MenuPermissionChecker,
  type MenuProps,
  type SubMenuProps
} from "xiaoye-components";

const menuProps: MenuProps = {
  mode: "horizontal",
  defaultActive: "dashboard",
  defaultOpeneds: ["analysis"],
  activeIndex: "dashboard",
  openedMenus: ["analysis"],
  uniqueOpened: true,
  router: true,
  menuTrigger: "click",
  collapse: false,
  items: [
    {
      index: "analysis",
      label: "分析中心",
      type: "submenu",
      children: [
        {
          index: "analysis-overview",
          label: "概览",
          badge: 12,
          extraText: "2 分钟前"
        }
      ]
    }
  ],
  permissionChecker: (permission, item) => {
    void item;
    return !permission || permission === "public";
  },
  ellipsis: true,
  popperOffset: 12,
  ellipsisIcon: "mdi:dots-horizontal",
  popperEffect: "light",
  popperClass: "menu-popper",
  popperStyle: {
    minWidth: "220px"
  },
  showTimeout: 160,
  hideTimeout: 180,
  closeOnClickOutside: true,
  collapseTransition: true,
  persistent: false,
  backgroundColor: "#0f172a",
  textColor: "#cbd5e1",
  activeTextColor: "#f8fafc"
};

const menuItemProps: MenuItemProps = {
  index: "dashboard",
  route: {
    path: "/dashboard"
  },
  disabled: false
};

const subMenuProps: SubMenuProps = {
  index: "analysis",
  disabled: false,
  teleported: true,
  popperOffset: 20,
  popperClass: "submenu-popper",
  popperStyle: {
    width: "240px"
  },
  showTimeout: 100,
  hideTimeout: 100,
  expandCloseIcon: "mdi:chevron-down",
  expandOpenIcon: "mdi:chevron-up"
};

const groupProps: MenuItemGroupProps = {
  title: "经营指标"
};

const selected: MenuItemClicked = {
  index: "dashboard",
  indexPath: ["dashboard"],
  route: "/dashboard"
};

const permissionChecker: MenuPermissionChecker = (permission, item) => {
  void item;
  return !permission || permission === "public";
};

const menuItems: MenuDataItem[] = [
  {
    index: "analysis",
    label: "分析中心",
    type: "submenu",
    icon: "mdi:chart-box-outline",
    children: [
      {
        index: "analysis-group",
        label: "经营指标",
        type: "group",
        children: [
          {
            index: "analysis-overview",
            label: "概览",
            route: {
              path: "/analysis/overview"
            },
            badge: "12",
            extraText: "2 分钟前",
            permission: "public"
          }
        ]
      }
    ]
  }
];

void menuProps;
void menuItemProps;
void subMenuProps;
void groupProps;
void selected;
void permissionChecker;
void menuItems;

const menuVNode = h(XyMenu, menuProps, () => [
  h(XyMenuItem, menuItemProps, () => "工作台"),
  h(XySubMenu, subMenuProps, {
    title: () => "分析中心",
    default: () => [
      h(XyMenuItemGroup, groupProps, {
        default: () => [h(XyMenuItem, { index: "analysis-report" }, () => "经营报表")]
      })
    ]
  }),
  h(XyMenu.Item, { index: "orders" }, () => "订单")
]);

void menuVNode;

const invalidMenuMode: MenuProps = {
  // @ts-expect-error invalid mode should be rejected
  mode: "inline"
};

const invalidMenuItemProps: MenuItemProps = {
  // @ts-expect-error index should be string
  index: 1
};

const invalidSubMenuProps: SubMenuProps = {
  index: "settings",
  // @ts-expect-error popperOffset should be number
  popperOffset: "20"
};

const invalidControlledProps: MenuProps = {
  // @ts-expect-error activeIndex should be string
  activeIndex: 1
};

const invalidItemsProp: MenuProps = {
  items: [
    {
      // @ts-expect-error index should be string
      index: 1,
      label: "错误节点"
    }
  ]
};

const invalidPermissionChecker: MenuProps = {
  // @ts-expect-error permissionChecker should return boolean
  permissionChecker: () => "allow"
};

const invalidMenuItemData: MenuDataItem = {
  index: "broken",
  label: "错误节点",
  // @ts-expect-error permission should be string or string[]
  permission: 1
};

void invalidMenuMode;
void invalidMenuItemProps;
void invalidSubMenuProps;
void invalidControlledProps;
void invalidItemsProp;
void invalidPermissionChecker;
void invalidMenuItemData;
