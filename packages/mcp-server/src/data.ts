import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  generatedAt: string;
  components: ComponentData[];
}

function loadSchema(): ApiSchema {
  const schemaPaths = [
    path.resolve(__dirname, "../../scripts/.llm-cache/api-schema.json"),
    path.resolve(process.cwd(), "scripts/.llm-cache/api-schema.json"),
  ];

  for (const schemaPath of schemaPaths) {
    if (fs.existsSync(schemaPath)) {
      const content = fs.readFileSync(schemaPath, "utf8");
      return JSON.parse(content);
    }
  }

  console.error(
    "Error: api-schema.json not found. Run `pnpm generate:llm` first."
  );
  process.exit(1);
}

const schema = loadSchema();
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
