export type EmptySize = "sm" | "md" | "lg";

export interface EmptyProps {
  description?: string;
  image?: string;
  size?: EmptySize;
}

export type EmptyInstance = InstanceType<import("./empty.vue").default>;
