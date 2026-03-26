import { h, ref } from "vue";
import type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerInstance,
  DrawerPlacement,
  DrawerProps,
  DrawerTransition
} from "xiaoye-components";
import { XyDrawer } from "xiaoye-components";

const placement: DrawerPlacement = "right";
const direction: DrawerDirection = "rtl";

const drawerProps: DrawerProps = {
  modelValue: true,
  title: "成员编辑面板",
  placement,
  direction,
  size: "45%",
  appendToBody: true,
  appendTo: "body",
  modal: true,
  modalClass: "drawer-mask",
  modalPenetrable: false,
  closeOnOverlay: true,
  closeOnClickModal: true,
  closeOnEsc: true,
  closeOnPressEscape: true,
  openDelay: 120,
  closeDelay: 80,
  destroyOnClose: false,
  showClose: true,
  lockScroll: true,
  withHeader: true,
  resizable: true,
  customClass: "legacy-drawer-panel",
  headerClass: "drawer-header",
  bodyClass: "drawer-body",
  footerClass: "drawer-footer",
  zIndex: 3100,
  headerAriaLevel: 3,
  modalFade: false,
  closeIcon: "mdi:close-circle-outline",
  fullscreen: false,
  transition: "xy-drawer-fade",
  beforeClose(done, reason) {
    const closeReason: DrawerCloseReason | undefined = reason;
    void closeReason;
    done();
  }
};

void drawerProps;

const drawerRef = ref<DrawerInstance>();
drawerRef.value?.handleClose("programmatic");

const vnode = h(
  XyDrawer,
  {
    title: "插槽面板",
    headerClass: "custom-header",
    bodyClass: "custom-body",
    footerClass: "custom-footer"
  },
  {
    header: ({
      close,
      titleId,
      titleClass
    }: {
      close: () => void;
      titleId: string;
      titleClass: string;
    }) =>
      h(
        "button",
        {
          id: titleId,
          class: titleClass,
          onClick: close
        },
        "关闭"
      ),
    title: ({ titleId, titleClass }: { titleId: string; titleClass: string }) =>
      h("span", { id: titleId, class: titleClass }, "兼容标题"),
    default: () => "body",
    footer: () => "footer"
  }
);

void vnode;

const invalidPlacement: DrawerProps = {
  // @ts-expect-error invalid placement should be rejected
  placement: "center"
};

void invalidPlacement;

const invalidDirection: DrawerProps = {
  // @ts-expect-error invalid direction should be rejected
  direction: "horizontal"
};

void invalidDirection;

const invalidResizable: DrawerProps = {
  // @ts-expect-error resizable should be a boolean
  resizable: "yes"
};

void invalidResizable;

const invalidCustomClass: DrawerProps = {
  // @ts-expect-error customClass should be a string
  customClass: 1
};

void invalidCustomClass;

const invalidZIndex: DrawerProps = {
  // @ts-expect-error zIndex should be a number
  zIndex: "3000"
};

void invalidZIndex;

const invalidHeaderAriaLevel: DrawerProps = {
  // @ts-expect-error headerAriaLevel should be a string or number
  headerAriaLevel: false
};

void invalidHeaderAriaLevel;

const transition: DrawerTransition = "xy-drawer-fade";

void transition;

const invalidTransition: DrawerProps = {
  // @ts-expect-error transition should be a string or TransitionProps
  transition: 1
};

void invalidTransition;
