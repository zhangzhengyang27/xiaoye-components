export type CardType = "default" | "bordered" | "shadow" | "flat";

export interface CardProps {
  title?: string;
  subTitle?: string;
  type?: CardType;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  headerStyle?: Record<string, string>;
  bodyStyle?: Record<string, string>;
  loading?: boolean;
}

export interface CardEmits {
  (e: "click", event: MouseEvent): void;
}

export type CardInstance = InstanceType<import("./card.vue").default>;
