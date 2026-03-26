import { defineComponent, h, ref } from "vue";
import {
  XyDialog,
  XyDialogService,
  type DialogInstance,
  type DialogAlertOptions,
  type DialogConfirmOptions,
  type DialogGlobalConfig,
  type DialogPromptOptions,
  type DialogProps,
  type DialogServiceOpenOptions
} from "xiaoye-components";

const dialogProps: DialogProps = {
  modelValue: true,
  title: "成员编辑",
  appendToBody: false,
  appendTo: "#dialog-target",
  destroyOnClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  lockScroll: true,
  modal: true,
  modalClass: "custom-dialog-mask",
  modalPenetrable: false,
  openDelay: 60,
  closeDelay: 40,
  top: "10vh",
  width: 640,
  zIndex: 3200,
  center: true,
  alignCenter: true,
  closeIcon: "mdi:close",
  draggable: true,
  overflow: true,
  fullscreen: false,
  resizable: true,
  minWidth: 360,
  maxWidth: "80%",
  minHeight: 180,
  maxHeight: 520,
  maximizable: true,
  stickyHeader: true,
  stickyFooter: true,
  bodyMaxHeight: 360,
  loading: true,
  loadingText: "处理中",
  headerClass: "dialog-header",
  bodyClass: "dialog-body",
  footerClass: "dialog-footer",
  showClose: true,
  headerAriaLevel: "3",
  transition: "xy-dialog-fade"
};

const dialogGlobalConfig: DialogGlobalConfig = {
  alignCenter: true,
  draggable: true,
  overflow: false,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  transition: "xy-dialog-fade",
  resizable: true,
  maximizable: true,
  stickyHeader: true,
  stickyFooter: false
};

const dialogRef = ref<DialogInstance | null>(null);
const CustomClose = defineComponent({
  name: "FixtureDialogClose",
  setup() {
    return () => h("span", "x");
  }
});

const dialogVNode = h(
  XyDialog,
  {
    ...dialogProps,
    closeIcon: CustomClose,
    ref: dialogRef
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
        "自定义标题"
      ),
    default: () => "主体内容",
    footer: () => "底部操作"
  }
);

dialogRef.value?.handleClose();
dialogRef.value?.resetPosition();
dialogRef.value?.dialogContentRef?.updatePosition();

const openOptions: DialogServiceOpenOptions = {
  title: "服务弹窗",
  message: "说明文案",
  dialogProps: {
    width: 480,
    maximizable: true
  },
  showCancelButton: true,
  confirmButtonText: "确认",
  cancelButtonText: "取消",
  confirmButtonProps: {
    type: "primary",
    loading: false
  },
  cancelButtonProps: {
    plain: true
  },
  beforeConfirm: async (ctx) => {
    ctx.close("confirm");
  },
  beforeCancel: (ctx) => {
    ctx.close("cancel");
  }
};

const confirmOptions: DialogConfirmOptions = {
  title: "确认标题",
  message: "确认内容"
};

const alertOptions: DialogAlertOptions = {
  title: "提示标题",
  message: "提示内容"
};

const promptOptions: DialogPromptOptions = {
  title: "输入标题",
  message: "请输入内容",
  inputValue: "默认值",
  inputPlaceholder: "请输入",
  inputType: "textarea",
  inputProps: {
    maxlength: 20
  },
  inputValidator: async (value) => value.trim() ? undefined : "必填"
};

const openHandle = XyDialogService.open(openOptions);
const confirmPromise = XyDialogService.confirm(confirmOptions);
const alertPromise = XyDialogService.alert(alertOptions);
const promptPromise = XyDialogService.prompt(promptOptions);

openHandle.close("programmatic");
openHandle.update({
  title: "已更新",
  message: "已更新内容"
});
void openHandle.result;
void confirmPromise;
void alertPromise;
void promptPromise;
XyDialogService.closeAll();

void dialogProps;
void dialogGlobalConfig;
void dialogVNode;
void openOptions;
void confirmOptions;
void alertOptions;
void promptOptions;

const invalidDialogProps: DialogProps = {
  // @ts-expect-error invalid width type should be rejected
  width: true
};

const invalidDialogProps2: DialogProps = {
  // @ts-expect-error invalid transition type should be rejected
  transition: 1
};

const invalidDialogProps3: DialogProps = {
  // @ts-expect-error invalid close icon type should be rejected
  closeIcon: 1
};

const invalidDialogProps4: DialogProps = {
  // @ts-expect-error invalid bodyMaxHeight type should be rejected
  bodyMaxHeight: false
};

const invalidPromptOptions: DialogPromptOptions = {
  // @ts-expect-error invalid input type should be rejected
  inputType: "number"
};

void invalidDialogProps;
void invalidDialogProps2;
void invalidDialogProps3;
void invalidDialogProps4;
void invalidPromptOptions;
