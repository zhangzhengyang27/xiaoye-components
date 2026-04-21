export interface MessageBoxOptions {
  title?: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error" | "question";
  icon?: string;
  dangerouslyUseHTMLString?: boolean;
  showClose?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: "primary" | "danger" | "default";
  cancelButtonType?: "default" | "text";
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  beforeClose?: (action: "confirm" | "cancel" | "close", done: () => void) => void;
}

export interface MessageBoxResult {
  action: "confirm" | "cancel" | "close";
  value?: string;
}

export interface XyuMessageBoxStatic {
  alert(message: string, title?: string, options?: MessageBoxOptions): Promise<MessageBoxResult>;
  confirm(message: string, title?: string, options?: MessageBoxOptions): Promise<MessageBoxResult>;
  prompt(message: string, title?: string, options?: MessageBoxOptions): Promise<MessageBoxResult & { value: string }>;
  close(): void;
}

export type { MessageBoxOptions, MessageBoxResult };
