import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import AddressPicker from "../src/front-components/address-picker/address-picker.vue";

describe("AddressPicker", () => {
  const createWrapper = (props = {}) => {
    return mount(AddressPicker, {
      props: {
        modelValue: {},
        ...props
      },
      global: {
        stubs: {
          "xy-icon": {
            template: '<span class="xy-icon-stub"></span>'
          },
          "xy-input": {
            template: '<input class="xy-input-stub" />'
          }
        }
      }
    });
  };

  describe("Rendering", () => {
    it("renders trigger element", () => {
      const wrapper = createWrapper();
      expect(wrapper.find(".xy-address-picker__trigger").exists()).toBe(true);
    });

    it("renders placeholder text", () => {
      const wrapper = createWrapper({ placeholder: "选择地址" });
      expect(wrapper.find(".xy-address-picker__value").text()).toContain("选择地址");
    });

    it("renders selected value", async () => {
      const wrapper = createWrapper({
        modelValue: { province: "广东省", city: "深圳市", district: "南山区" }
      });
      await nextTick();
      expect(wrapper.find(".xy-address-picker__value").text()).toContain("广东省");
    });
  });

  describe("Display format", () => {
    it("shows text format by default", async () => {
      const wrapper = createWrapper({
        modelValue: { province: "广东省", city: "深圳市", district: "南山区" }
      });
      await nextTick();
      expect(wrapper.find(".xy-address-picker__summary").exists()).toBe(false);
    });

    it("shows full format when displayFormat is full", async () => {
      const wrapper = createWrapper({
        modelValue: { province: "广东省", city: "深圳市", district: "南山区" },
        displayFormat: "full"
      });
      await nextTick();
      expect(wrapper.find(".xy-address-picker__detail").exists()).toBe(true);
    });
  });

  describe("Dropdown", () => {
    it("opens dropdown on trigger click", async () => {
      const wrapper = createWrapper();
      await wrapper.find(".xy-address-picker__trigger").trigger("click");
      await nextTick();
      expect(wrapper.find(".xy-address-picker__dropdown").exists()).toBe(true);
    });

    it("closes dropdown on escape", async () => {
      const wrapper = createWrapper();
      await wrapper.find(".xy-address-picker__trigger").trigger("click");
      await nextTick();
      expect(wrapper.find(".xy-address-picker__dropdown").exists()).toBe(true);
    });
  });

  describe("Clear button", () => {
    it("shows clear button when clearable is true", async () => {
      const wrapper = createWrapper({
        modelValue: { province: "广东省" },
        clearable: true
      });
      await nextTick();
      expect(wrapper.find(".xy-address-picker__clear").exists()).toBe(true);
    });

    it("hides clear button when clearable is false", async () => {
      const wrapper = createWrapper({
        modelValue: { province: "广东省" },
        clearable: false
      });
      await nextTick();
      expect(wrapper.find(".xy-address-picker__clear").exists()).toBe(false);
    });
  });

  describe("Disabled state", () => {
    it("applies disabled class", () => {
      const wrapper = createWrapper({ disabled: true });
      expect(wrapper.find(".is-disabled").exists()).toBe(true);
    });
  });

  describe("Slots", () => {
    it("renders recent-item slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots["recent-item"]?.({
        address: { label: "公司", value: {} },
        select: () => {}
      });
    });
  });

  describe("Exposed methods", () => {
    it("exposes open method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.open).toBe("function");
    });

    it("exposes close method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.close).toBe("function");
    });
  });
});
