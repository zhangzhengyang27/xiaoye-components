export type NotificationType = "success" | "warning" | "error" | "info" | "";

export interface NotificationOptions {
  title?: string;
  message?: string;
  type?: NotificationType;
  duration?: number;
  showClose?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  offset?: number;
  zIndex?: number;
  onClose?: () => void;
}

export type Notification = (options: NotificationOptions) => { close: () => void };
