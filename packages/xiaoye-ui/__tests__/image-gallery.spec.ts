import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import ImageGallery from "../src/front-components/image-gallery/image-gallery.vue";

describe("ImageGallery", () => {
  const createWrapper = (props = {}) => {
    return mount(ImageGallery, {
      props: {
        images: [
          { src: "https://example.com/1.jpg", alt: "图片1" },
          { src: "https://example.com/2.jpg", alt: "图片2" },
          { src: "https://example.com/3.jpg", alt: "图片3" }
        ],
        ...props
      },
      global: {
        stubs: {
          "xy-image": {
            template: '<div class="xy-image-stub"></div>'
          },
          "xy-icon": {
            template: '<span class="xy-icon-stub"></span>'
          },
          "xy-image-viewer": {
            template: '<div class="xy-image-viewer-stub"></div>'
          }
        }
      }
    });
  };

  describe("Rendering", () => {
    it("renders main image container", () => {
      const wrapper = createWrapper();
      expect(wrapper.find(".xy-image-gallery__main").exists()).toBe(true);
    });

    it("renders thumbnails when showThumbnails is true", () => {
      const wrapper = createWrapper({ showThumbnails: true });
      expect(wrapper.find(".xy-image-gallery__thumbnails").exists()).toBe(true);
    });

    it("hides thumbnails when showThumbnails is false", () => {
      const wrapper = createWrapper({ showThumbnails: false });
      expect(wrapper.find(".xy-image-gallery__thumbnails").exists()).toBe(false);
    });

    it("renders counter when showCounter is true", async () => {
      const wrapper = createWrapper({ showCounter: true });
      await nextTick();
      expect(wrapper.find(".xy-image-gallery__counter").exists()).toBe(true);
    });
  });

  describe("Thumbnail position", () => {
    it("applies bottom position class (default)", () => {
      const wrapper = createWrapper({ thumbnailPosition: "bottom" });
      expect(wrapper.find(".xy-image-gallery--thumbnails-bottom").exists()).toBe(true);
    });

    it("applies left position class", () => {
      const wrapper = createWrapper({ thumbnailPosition: "left" });
      expect(wrapper.find(".xy-image-gallery--thumbnails-left").exists()).toBe(true);
    });

    it("applies right position class", () => {
      const wrapper = createWrapper({ thumbnailPosition: "right" });
      expect(wrapper.find(".xy-image-gallery--thumbnails-right").exists()).toBe(true);
    });
  });

  describe("Empty state", () => {
    it("shows empty state when no images", () => {
      const wrapper = createWrapper({ images: [] });
      expect(wrapper.find(".xy-image-gallery__empty").exists()).toBe(true);
    });
  });

  describe("Events", () => {
    it("emits change event on image switch", async () => {
      const wrapper = createWrapper();
      await wrapper.vm.handleNext();
      await nextTick();
      expect(wrapper.emitted("change")).toBeTruthy();
    });
  });

  describe("Slots", () => {
    it("renders thumbnail slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.thumbnail?.({ image: wrapper.vm.images[0], index: 0, active: false });
    });

    it("renders overlay slot", () => {
      const wrapper = createWrapper();
      wrapper.vm.$slots.overlay?.({ image: wrapper.vm.images[0], index: 0 });
    });
  });

  describe("Exposed methods", () => {
    it("exposes currentIndex ref", () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.currentIndex).toBeDefined();
    });

    it("exposes setIndex method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.setIndex).toBe("function");
    });

    it("exposes prev method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.prev).toBe("function");
    });

    it("exposes next method", () => {
      const wrapper = createWrapper();
      expect(typeof wrapper.vm.next).toBe("function");
    });
  });
});
