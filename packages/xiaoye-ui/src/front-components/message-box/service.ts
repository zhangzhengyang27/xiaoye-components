import type { MessageBoxOptions, MessageBoxResult } from "./types";

const defaultOptions: Required<MessageBoxOptions> = {
  title: "提示",
  message: "",
  type: "info",
  icon: "",
  dangerouslyUseHTMLString: false,
  showClose: true,
  showCancelButton: true,
  showConfirmButton: true,
  confirmText: "确定",
  cancelText: "取消",
  confirmButtonType: "primary",
  cancelButtonType: "default",
  closeOnClickModal: true,
  closeOnPressEscape: true,
  beforeClose: undefined
};

let containerEl: HTMLElement | null = null;
let currentResolve: ((result: MessageBoxResult) => void) | null = null;

const icons: Record<string, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
  question: "❓"
};

function createContainer() {
  if (!containerEl) {
    containerEl = document.createElement("div");
    containerEl.className = "xyu-message-box-container";
    document.body.appendChild(containerEl);
  }
  return containerEl;
}

function render(options: Required<MessageBoxOptions>) {
  const container = createContainer();
  const icon = options.icon || icons[options.type] || "";

  const overlay = document.createElement("div");
  overlay.className = "xyu-message-box__overlay";

  const box = document.createElement("div");
  box.className = "xyu-message-box";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");

  const header = document.createElement("div");
  header.className = "xyu-message-box__header";
  header.innerHTML = `
    ${icon ? `<span class="xyu-message-box__icon">${icon}</span>` : ""}
    <span class="xyu-message-box__title">${options.title}</span>
    ${options.showClose ? `<button class="xyu-message-box__close">✕</button>` : ""}
  `;

  const body = document.createElement("div");
  body.className = "xyu-message-box__body";
  if (options.dangerouslyUseHTMLString) {
    body.innerHTML = options.message;
  } else {
    body.textContent = options.message;
  }

  const footer = document.createElement("div");
  footer.className = "xyu-message-box__footer";
  if (options.showCancelButton) {
    const cancelBtn = document.createElement("button");
    cancelBtn.className = `xyu-message-box__btn xyu-message-box__btn--cancel`;
    cancelBtn.textContent = options.cancelText;
    footer.appendChild(cancelBtn);
  }
  if (options.showConfirmButton) {
    const confirmBtn = document.createElement("button");
    confirmBtn.className = `xyu-message-box__btn xyu-message-box__btn--confirm xyu-btn--${options.confirmButtonType}`;
    confirmBtn.textContent = options.confirmText;
    footer.appendChild(confirmBtn);
  }

  box.appendChild(header);
  box.appendChild(body);
  if (footer.children.length) box.appendChild(footer);
  container.appendChild(overlay);
  container.appendChild(box);

  const closeBox = (action: MessageBoxResult["action"]) => {
    container.removeChild(overlay);
    container.removeChild(box);
    if (!container.children.length) {
      document.body.removeChild(container);
      containerEl = null;
    }
    if (currentResolve) {
      currentResolve({ action });
      currentResolve = null;
    }
  };

  overlay.onclick = () => {
    if (options.closeOnClickModal) closeBox("close");
  };

  const closeBtn = box.querySelector(".xyu-message-box__close");
  closeBtn?.addEventListener("click", () => closeBox("close"));

  const cancelBtnEl = box.querySelector(".xyu-message-box__btn--cancel") as HTMLButtonElement;
  cancelBtnEl?.addEventListener("click", () => closeBox("cancel"));

  const confirmBtnEl = box.querySelector(".xyu-message-box__btn--confirm") as HTMLButtonElement;
  confirmBtnEl?.addEventListener("click", () => closeBox("confirm"));

  if (options.closeOnPressEscape) {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeBox("close");
        document.removeEventListener("keydown", onKeydown);
      }
    };
    document.addEventListener("keydown", onKeydown);
  }
}

function normalizeOptions(message: string, title?: string | MessageBoxOptions, opts?: MessageBoxOptions): Required<MessageBoxOptions> {
  let normalizedTitle: string;
  let normalizedOpts: MessageBoxOptions;
  if (typeof title === "string") {
    normalizedTitle = title;
    normalizedOpts = opts ?? {};
  } else {
    normalizedTitle = title?.title ?? defaultOptions.title;
    normalizedOpts = title ?? {};
  }
  return { ...defaultOptions, ...normalizedOpts, message, title: normalizedTitle };
}

const MessageBox: XyuMessageBoxStatic = {
  alert(message: string, title?: string | MessageBoxOptions, options?: MessageBoxOptions) {
    const opts = normalizeOptions(message, title, options);
    opts.showCancelButton = false;
    opts.showClose = false;
    render(opts);
    return new Promise<MessageBoxResult>((resolve) => { currentResolve = resolve; });
  },

  confirm(message: string, title?: string | MessageBoxOptions, options?: MessageBoxOptions) {
    const opts = normalizeOptions(message, title, options);
    opts.showCancelButton = true;
    opts.showConfirmButton = true;
    render(opts);
    return new Promise<MessageBoxResult>((resolve) => { currentResolve = resolve; });
  },

  prompt(message: string, title?: string | MessageBoxOptions, options?: MessageBoxOptions) {
    const opts = normalizeOptions(message, title, options);
    opts.showCancelButton = true;
    opts.showConfirmButton = true;
    opts.showClose = false;
    render(opts);
    return new Promise<MessageBoxResult & { value: string }>((resolve) => { currentResolve = resolve as any; });
  },

  close() {
    if (containerEl) {
      containerEl.innerHTML = "";
      document.body.removeChild(containerEl);
      containerEl = null;
    }
    if (currentResolve) {
      currentResolve({ action: "close" });
      currentResolve = null;
    }
  }
};

export default MessageBox;
