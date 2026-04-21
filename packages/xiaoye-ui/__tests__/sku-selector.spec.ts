import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import SkuSelector from "../src/front-components/sku-selector/sku-selector.vue";

describe("SkuSelector", () => {
  const createWrapper = (props = {}) => {
    return mount(SkuSelector, {
      props: {
        dimensions: [
          {
            name: "颜色",
            type: "text" as const,
            options: [
              { value: "red", label: "红色" },
              { value: "blue", label: "蓝色" }
            ]
          },
          {
            name: "尺码",
            type: "text" as const,
            options: [
              { value: "s", label: "S" },
              { value: "m", label: "M" }
            ]
          }
        ],
        ...props
      }
    });
  };

  describe("Rendering", () => {
    it("renders dimension headers", () => {
      const wrapper = createWrapper();
      expect(wrapper.findAll(".xy-sku-selector__dimension").length).toBe(2);
    });

    it("renders dimension names", () => {
      const wrapper = createWrapper();
      expect(wrapper.find(".xy-sku-selector__dimension-name").text()).toBe("颜色");
    });

    it("renders option buttons", () => {
      const wrapper = createWrapper();
      expect(wrapper.findAll(".xy-sku-selector__option").length).toBe(4);
    });
  });

  describe("Selection", () => {
    it("selects option on click", async () => {
      const wrapper = createWrapper();
      const options = wrapper.findAll(".xy-sku-selector__option");
      await options[0].trigger("click");
      await nextTick();
      expect(wrapper.props("modelValue")).toHaveProperty("颜色", "red");
    });

    it("deselects option when clicking selected option", async () => {
      const wrapper = createWrapper({
        modelValue: { 颜色: "red" }
      });
      const options = wrapper.findAll(".xy-sku-selector__option");
      await options[0].trigger("click");
      await nextTick();
    });

    it("emits update:modelValue on selection", async () => {
      const wrapper = createWrapper();
      const options = wrapper.findAll(".xy-sku-selector__option");
      await options[0].trigger("click");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  describe("Stock matrix", () => {
    it("disables options with no stock", () => {
      const wrapper = createWrapper({
        matrix: {
          "red;s": { stock: 0 },
          "red;m": { stock: 5 },
          "blue;s": { stock: 3 },
          "blue;m": { stock: 0 }
        }
      });
      const disabledOptions = wrapper.findAll(".xy-sku-selector__option.is-disabled");
      expect(disabledOptions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Option types", () => {
    it("renders color option", () => {
      const wrapper = createWrapper({
        dimensions: [
          {
            name: "颜色",
            type: "color" as const,
            options: [{ value: "red", label: "红色", color: "#FF0000" }]
          }
        ]
      });
      expect(wrapper.find(".xy-sku-selector__option--color").exists()).toBe(true);
    });

    it("renders image option", () => {
      const wrapper = createWrapper({
        dimensions: [
          {
            name: "款式",
            type: "image" as const,
            options: [{ value: "img1", label: "款式1", image: "https://example.com/1.jpg" }]
          }
        ]
      });
      expect(wrapper.find(".xy-sku-selector__option--image").exists()).toBe(true);
    });
  });

  describe("Disabled state", () => {
    it("applies disabled class when disabled prop is true", () => {
      const wrapper = createWrapper({ disabled: true });
      expect(wrapper.find(".is-disabled").exists()).toBe(true);
    });
  });

  describe("Slots", () => {
    it("renders dimension-label slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots["dimension-label"]?.({ dimension: wrapper.vm.dimensions[0] });
    });

    it("renders option slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.option?.({
        option: { value: "red", label: "红色" },
        active: false,
        disabled: false
      });
    });

    it("renders stock slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.stock?.({ totalStock: 100, available: true });
    });
  });

  describe("Exposed methods", () => {
    it("exposes clearSelection method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.clearSelection).toBe("function");
    });
  });
});
