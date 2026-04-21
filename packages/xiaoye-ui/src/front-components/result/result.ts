export type ResultType = "success" | "warning" | "error" | "info" | "404" | "403" | "500" | "403" | "empty";

export interface ResultProps {
  title?: string;
  description?: string;
  icon?: string;
  type?: ResultType;
}

export type ResultInstance = InstanceType<import("./result.vue").default>;
