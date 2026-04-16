import { defineComponent, h } from "vue";
import { vi } from "vitest";

// 全局 mock @iconify/vue，解决 mdi.ts 使用 addCollection 的问题
vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  }),
  addCollection: vi.fn()
}));
