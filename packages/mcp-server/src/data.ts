import { apiSchema } from "./api-schema.js";

interface ComponentProp {
  name: string;
  description: string;
  type: string;
  default: string;
}

interface ComponentEvent {
  name: string;
  description: string;
  params: string;
}

interface ComponentSlot {
  name: string;
  description: string;
  props: string;
}

interface ComponentExpose {
  name: string;
  description: string;
  type: string;
}

interface ComponentData {
  name: string;
  title: string;
  description: string;
  tags: string[];
  exports: string[];
  layer: "base" | "pro";
  props: ComponentProp[];
  events: ComponentEvent[];
  slots: ComponentSlot[];
  exposes: ComponentExpose[];
}

interface ApiSchema {
  version: string;
  components: ComponentData[];
}

// api-schema.ts 由 pnpm generate:llm 生成并随包发布，无需运行时读文件
const schema = apiSchema as unknown as ApiSchema;
const components = schema.components;

const baseComponents = components.filter((c) => c.layer === "base");
const proComponents = components.filter((c) => c.layer === "pro");

export { schema, components, baseComponents, proComponents };
export type {
  ComponentData,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  ComponentExpose,
  ApiSchema,
};
