import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";
import ProductCard from "../src/front-components/product-card/product-card.vue";

describe("ProductCard", () => {
  const createWrapper = (props = {}) => {
    return mount(ProductCard, {
      props: {
        image: "https://example.com/image.jpg",
        title: "Test Product",
        description: "Test Description",
        price: 999,
        ...props
      },
      global: {
        stubs: {
          "xy-image": {
            template: '<div class="xy-image-stub"></div>'
          },
          "xy-badge": {
            template: '<span class="xy-badge-stub"><slot /></span>'
          },
          "xy-icon": {
            template: '<span class="xy-icon-stub"></span>'
          }
        }
      }
    });
  };

  describe("Rendering", () => {
    it("renders product title", () => {
      const wrapper = createWrapper({ title: "iPhone 15" });
      expect(wrapper.find(".xy-product-card__title").text()).toBe("iPhone 15");
    });

    it("renders product description", () => {
      const wrapper = createWrapper({ description: "Latest iPhone" });
      expect(wrapper.find(".xy-product-card__description").text()).toBe("Latest iPhone");
    });

    it("renders formatted price", () => {
      const wrapper = createWrapper({ price: 9999 });
      expect(wrapper.find(".xy-product-card__price-current").text()).toContain("9999.00");
    });

    it("renders original price with strikethrough", () => {
      const wrapper = createWrapper({ price: 999, originalPrice: 1299 });
      expect(wrapper.find(".xy-product-card__price-original").exists()).toBe(true);
    });

    it("renders tags when provided", () => {
      const wrapper = createWrapper({
        tags: [
          { text: "新品", type: "primary" },
          { text: "热卖", type: "danger" }
        ]
      });
      expect(wrapper.find(".xy-product-card__tags").exists()).toBe(true);
    });

    it("renders stock information", () => {
      const wrapper = createWrapper({ stock: 50 });
      expect(wrapper.find(".xy-product-card__stock").exists()).toBe(true);
    });
  });

  describe("Status", () => {
    it("shows soldout overlay when status is soldout", () => {
      const wrapper = createWrapper({ status: "soldout" });
      expect(wrapper.find(".xy-product-card__status-overlay").exists()).toBe(true);
    });

    it("shows offline overlay when status is offline", () => {
      const wrapper = createWrapper({ status: "offline" });
      expect(wrapper.find(".xy-product-card__status-overlay").exists()).toBe(true);
    });

    it("shows soldout text when stock is 0", () => {
      const wrapper = createWrapper({ stock: 0 });
      expect(wrapper.find(".xy-product-card--soldout").exists()).toBe(true);
    });
  });

  describe("Size variants", () => {
    it("applies sm size class", () => {
      const wrapper = createWrapper({ size: "sm" });
      expect(wrapper.find(".xy-product-card--sm").exists()).toBe(true);
    });

    it("applies md size class (default)", () => {
      const wrapper = createWrapper({ size: "md" });
      expect(wrapper.find(".xy-product-card--md").exists()).toBe(true);
    });

    it("applies lg size class", () => {
      const wrapper = createWrapper({ size: "lg" });
      expect(wrapper.find(".xy-product-card--lg").exists()).toBe(true);
    });
  });

  describe("Horizontal layout", () => {
    it("applies horizontal class when enabled", () => {
      const wrapper = createWrapper({ horizontal: true });
      expect(wrapper.find(".xy-product-card--horizontal").exists()).toBe(true);
    });
  });

  describe("Multiple images", () => {
    it("renders navigation buttons for multiple images", () => {
      const wrapper = createWrapper({
        image: [
          "https://example.com/1.jpg",
          "https://example.com/2.jpg",
          "https://example.com/3.jpg"
        ]
      });
      expect(wrapper.find(".xy-product-card__image-nav").exists()).toBe(true);
    });

    it("renders thumbnails for multiple images", () => {
      const wrapper = createWrapper({
        image: [
          "https://example.com/1.jpg",
          "https://example.com/2.jpg"
        ]
      });
      expect(wrapper.find(".xy-product-card__thumbnails").exists()).toBe(true);
    });

    it("shows prev button as disabled on first image", async () => {
      const wrapper = createWrapper({
        image: [
          "https://example.com/1.jpg",
          "https://example.com/2.jpg"
        ]
      });
      const prevBtn = wrapper.find(".xy-product-card__nav-prev");
      expect(prevBtn.attributes("disabled")).toBeDefined();
    });
  });

  describe("Slots", () => {
    it("renders default slot content", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.default?.();
    });

    it("renders image slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.image?.();
    });

    it("renders header slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.header?.();
    });

    it("renders footer slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.footer?.();
    });

    it("renders actions slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.actions?.();
    });
  });

  describe("Price formatting", () => {
    it("handles numeric price", () => {
      const wrapper = createWrapper({ price: 9999 });
      expect(wrapper.find(".xy-product-card__price-current").text()).toContain("9999.00");
    });

    it("handles string price", () => {
      const wrapper = createWrapper({ price: "199.50" });
      expect(wrapper.find(".xy-product-card__price-current").text()).toContain("199.50");
    });

    it("handles invalid price gracefully", () => {
      const wrapper = createWrapper({ price: "invalid" });
      expect(wrapper.find(".xy-product-card__price-current").text()).toBe("invalid");
    });
  });
});
