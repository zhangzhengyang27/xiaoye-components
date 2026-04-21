export type MessageType = "success" | "warning" | "error" | "info" | "";
export type MessageEffect = "light" | "dark";

export interface MessageOptions {
  message: string;
  type?: MessageType;
  duration?: number;
  showClose?: boolean;
  onClose?: () => void;
  effect?: MessageEffect;
}

export type Message = (options: string | MessageOptions) => { close: () => void };
