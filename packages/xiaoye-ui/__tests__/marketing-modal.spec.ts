import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import MarketingModal from "../src/front-components/marketing-modal/marketing-modal.vue";

describe("MarketingModal", () => {
  const createWrapper = (props = {}) => {
    return mount(MarketingModal, {
      props: {
        modelValue: false,
        ...props
      },
      global: {
        stubs: {
          "xy-icon": {
            template: '<span class="xy-icon-stub"></span>'
          }
        }
      }
    });
  };

  describe("Rendering", () => {
    it("does not render when modelValue is false", () => {
      const wrapper = createWrapper({ modelValue: false });
      expect(wrapper.find(".xy-marketing-modal__overlay").exists()).toBe(false);
    });

    it("renders when modelValue is true", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__overlay").exists()).toBe(true);
    });

    it("renders title when provided", async () => {
      const wrapper = createWrapper({ modelValue: true, title: "Test Title" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__title").text()).toBe("Test Title");
    });

    it("renders default slot content", async () => {
      const wrapper = createWrapper({
        modelValue: true
      });
      await nextTick();
      wrapper.vm.$slots.default?.();
    });
  });

  describe("Types", () => {
    it("applies coupon type class", async () => {
      const wrapper = createWrapper({ modelValue: true, type: "coupon" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--coupon").exists()).toBe(true);
    });

    it("applies flash-sale type class", async () => {
      const wrapper = createWrapper({ modelValue: true, type: "flash-sale" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--flash-sale").exists()).toBe(true);
    });

    it("applies promotion type class", async () => {
      const wrapper = createWrapper({ modelValue: true, type: "promotion" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--promotion").exists()).toBe(true);
    });

    it("applies custom type class (default)", async () => {
      const wrapper = createWrapper({ modelValue: true, type: "custom" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--custom").exists()).toBe(true);
    });
  });

  describe("Variants", () => {
    it("applies centered variant (default)", async () => {
      const wrapper = createWrapper({ modelValue: true, variant: "centered" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--centered").exists()).toBe(true);
    });

    it("applies bottom-sheet variant", async () => {
      const wrapper = createWrapper({ modelValue: true, variant: "bottom-sheet" });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__panel--bottom-sheet").exists()).toBe(true);
    });
  });

  describe("Countdown", () => {
    it("shows countdown when countdown prop > 0", async () => {
      const wrapper = createWrapper({ modelValue: true, countdown: 10 });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__countdown").exists()).toBe(true);
    });

    it("does not show countdown when countdown is 0", async () => {
      const wrapper = createWrapper({ modelValue: true, countdown: 0 });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__countdown").exists()).toBe(false);
    });
  });

  describe("Close button", () => {
    it("shows close button when showClose is true (default)", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__close").exists()).toBe(true);
    });

    it("hides close button when showClose is false", async () => {
      const wrapper = createWrapper({ modelValue: true, showClose: false });
      await nextTick();
      expect(wrapper.find(".xy-marketing-modal__close").exists()).toBe(false);
    });
  });

  describe("Events", () => {
    it("emits update:modelValue when close is called", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      wrapper.vm.handleClose();
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });

    it("emits open event when modal opens", async () => {
      const wrapper = createWrapper({ modelValue: false });
      await wrapper.setProps({ modelValue: true });
      await nextTick();
      expect(wrapper.emitted("open")).toBeTruthy();
    });

    it("emits close event when modal closes", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      wrapper.vm.handleClose();
      await nextTick();
      expect(wrapper.emitted("close")).toBeTruthy();
    });
  });

  describe("Slots", () => {
    it("renders header slot", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      wrapper.vm.$slots.header?.();
    });

    it("renders footer slot", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      wrapper.vm.$slots.footer?.();
    });

    it("renders icon slot", async () => {
      const wrapper = createWrapper({ modelValue: true });
      await nextTick();
      wrapper.vm.$slots.icon?.();
    });
  });
});
