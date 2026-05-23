#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  components,
  baseComponents,
  proComponents,
} from "./data.js";
import type { ComponentData } from "./data.js";

const server = new McpServer(
  {
    name: "xiaoye-components",
    version: "0.1.0",
  },
  {
    instructions: `You are working with xiaoye-components, a Vue 3 component library for mid-office and back-office scenarios.

Key conventions:
- Component tags use kebab-case with "xy-" prefix: xy-button, xy-dialog, xy-pro-table
- TypeScript identifiers use PascalCase with "Xy" prefix: XyButton, XyDialog, XyProTable
- v-model convention: v-model="value" maps to modelValue / update:model-value
- Global sizes: "sm" | "md" | "lg"
- Icons use Iconify format: icon="mdi:loading"

When suggesting components, prefer:
- Dialog for blocking interactions, Drawer for side panels
- ProTable over Table for data-heavy pages
- SearchForm for filter bars, ProForm for complex forms
- ListPage/CrudPage for standard CRUD pages

Always call list_components first to see what's available, then get_component_api for specific API details.`,
  }
);

server.tool(
  "list_components",
  "List all available components with brief descriptions. Returns component name, title, tags, and layer (base/pro).",
  {
    layer: z
      .enum(["all", "base", "pro"])
      .default("all")
      .describe("Filter by component layer: base (@xiaoye/components) or pro (@xiaoye/pro-components)"),
  },
  async ({ layer }) => {
    const list =
      layer === "base"
        ? baseComponents
        : layer === "pro"
          ? proComponents
          : components;

    const lines = [
      `# xiaoye-components (${list.length} components)`,
      "",
      "| Component | Tag | Layer | Description |",
      "|-----------|-----|-------|-------------|",
    ];

    for (const comp of list) {
      const tag = comp.tags[0] || comp.name;
      lines.push(
        `| ${comp.name} | \`${tag}\` | ${comp.layer} | ${comp.description || comp.title} |`
      );
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  }
);

server.tool(
  "get_component_api",
  "Get the full API reference for a specific component, including Props, Events, Slots, and Exposes.",
  {
    name: z
      .string()
      .describe(
        "Component name in kebab-case (e.g. 'button', 'dialog', 'pro-table', 'search-form')"
      ),
  },
  async ({ name }) => {
    const comp = components.find(
      (c) =>
        c.name === name ||
        c.tags.includes(name) ||
        c.tags.includes(`xy-${name}`) ||
        c.exports.some(
          (e) => e.toLowerCase() === name.toLowerCase() || e === `Xy${name.charAt(0).toUpperCase()}${name.slice(1)}`
        )
    );

    if (!comp) {
      const suggestions = components
        .filter((c) => c.name.includes(name) || c.title.includes(name))
        .slice(0, 5)
        .map((c) => c.name);

      return {
        content: [
          {
            type: "text",
            text: `Component "${name}" not found.${
              suggestions.length > 0
                ? ` Did you mean: ${suggestions.join(", ")}?`
                : ` Call list_components to see all available components.`
            }`,
          },
        ],
        isError: true,
      };
    }

    const lines = renderComponentApi(comp);
    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  }
);

server.tool(
  "search_components",
  "Search components by keyword. Searches component names, titles, descriptions, and tag names.",
  {
    query: z
      .string()
      .describe(
        "Search keyword (e.g. 'form', 'table', 'dialog', 'upload', 'date')"
      ),
  },
  async ({ query }) => {
    const lowerQuery = query.toLowerCase();
    const matches = components.filter((comp) => {
      const searchable = [
        comp.name,
        comp.title,
        comp.description,
        ...comp.tags,
        ...comp.exports,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(lowerQuery);
    });

    if (matches.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No components found matching "${query}". Call list_components to see all available components.`,
          },
        ],
      };
    }

    const lines = [
      `# Search results for "${query}" (${matches.length} found)`,
      "",
    ];

    for (const comp of matches) {
      const tag = comp.tags[0] || comp.name;
      lines.push(`## ${comp.title}`);
      lines.push(`- Name: ${comp.name}`);
      lines.push(`- Tag: \`${tag}\``);
      lines.push(`- Layer: ${comp.layer}`);
      if (comp.description) {
        lines.push(`- Description: ${comp.description}`);
      }
      lines.push(
        `- API: ${comp.props.length} props, ${comp.events.length} events, ${comp.slots.length} slots, ${comp.exposes.length} exposes`
      );
      lines.push("");
    }

    lines.push(
      "Use get_component_api with a component name to see full API details."
    );

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  }
);

function renderComponentApi(comp: ComponentData): string[] {
  const lines: string[] = [];
  const tag = comp.tags[0] || comp.name;

  lines.push(`# ${comp.title}`);
  if (comp.description) {
    lines.push("");
    lines.push(comp.description);
  }
  lines.push("");
  lines.push(`- **Tag**: \`${tag}\``);
  lines.push(`- **Exports**: ${comp.exports.map((e) => `\`${e}\``).join(", ")}`);
  lines.push(`- **Layer**: ${comp.layer === "base" ? "@xiaoye/components" : "@xiaoye/pro-components"}`);

  if (comp.props.length > 0) {
    lines.push("");
    lines.push("## Props");
    lines.push("");
    lines.push("| Property | Type | Default | Description |");
    lines.push("|----------|------|---------|-------------|");
    for (const prop of comp.props) {
      lines.push(
        `| \`${prop.name}\` | \`${prop.type}\` | ${prop.default || "-"} | ${prop.description} |`
      );
    }
  }

  if (comp.events.length > 0) {
    lines.push("");
    lines.push("## Events");
    lines.push("");
    lines.push("| Event | Params | Description |");
    lines.push("|-------|--------|-------------|");
    for (const event of comp.events) {
      lines.push(
        `| \`${event.name}\` | \`${event.params}\` | ${event.description} |`
      );
    }
  }

  if (comp.slots.length > 0) {
    lines.push("");
    lines.push("## Slots");
    lines.push("");
    lines.push("| Slot | Description |");
    lines.push("|------|-------------|");
    for (const slot of comp.slots) {
      const propsInfo = slot.props ? ` (receives \`${slot.props}\`)` : "";
      lines.push(`| \`${slot.name}\` | ${slot.description}${propsInfo} |`);
    }
  }

  if (comp.exposes.length > 0) {
    lines.push("");
    lines.push("## Exposes");
    lines.push("");
    lines.push("| Name | Type | Description |");
    lines.push("|------|------|-------------|");
    for (const expose of comp.exposes) {
      lines.push(
        `| \`${expose.name}\` | \`${expose.type}\` | ${expose.description} |`
      );
    }
  }

  return lines;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `xiaoye-components MCP server running (${components.length} components loaded)`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
