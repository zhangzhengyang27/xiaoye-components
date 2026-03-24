import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyAvatar, XyAvatarGroup } from "@xiaoye/components";

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
  })
}));

const mountedWrappers: VueWrapper[] = [];

function mountAvatar(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("XyAvatar", () => {
  it("优先渲染图片，并支持 alt、srcSet 和 fit", () => {
    const wrapper = mountAvatar(XyAvatar, {
      props: {
        src: "https://example.com/avatar.png",
        alt: "avatar",
        srcSet: "https://example.com/avatar.png 1x",
        fit: "contain",
        icon: "mdi:account-outline"
      },
      slots: {
        default: "叶"
      }
    });

    const image = wrapper.get("img");

    expect(image.attributes("src")).toBe("https://example.com/avatar.png");
    expect(image.attributes("alt")).toBe("avatar");
    expect(image.attributes("srcset")).toContain("avatar.png 1x");
    expect(image.attributes("style")).toContain("object-fit: contain");
    expect(wrapper.find('[data-icon="mdi:account-outline"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain("叶");
  });

  it("图片加载失败后会回退到 icon，并在 src 变化后重新尝试图片", async () => {
    const wrapper = mountAvatar(XyAvatar, {
      props: {
        src: "https://example.com/broken.png",
        icon: "mdi:account-outline"
      }
    });

    await wrapper.get("img").trigger("error");

    expect(wrapper.emitted("error")).toHaveLength(1);
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find('[data-icon="mdi:account-outline"]').exists()).toBe(true);

    await wrapper.setProps({
      src: "https://example.com/next.png"
    });
    await nextTick();

    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("没有图片和 icon 时支持默认插槽回退", () => {
    const wrapper = mountAvatar(XyAvatar, {
      props: {
        shape: "square",
        size: "lg"
      },
      slots: {
        default: "叶"
      }
    });

    expect(wrapper.classes()).toContain("xy-avatar--square");
    expect(wrapper.classes()).toContain("xy-avatar--lg");
    expect(wrapper.find(".xy-avatar__text").text()).toBe("叶");
  });

  it("支持数字尺寸和 icon 展示", () => {
    const wrapper = mountAvatar(XyAvatar, {
      props: {
        size: 48,
        icon: "mdi:account-outline"
      }
    });

    expect(wrapper.attributes("style")).toContain("--xy-avatar-size: 48px");
    expect(wrapper.attributes("style")).toContain("--xy-avatar-icon-size");
    expect(wrapper.classes()).toContain("is-icon");
    expect(wrapper.find('[data-icon="mdi:account-outline"]').exists()).toBe(true);
  });
});

describe("XyAvatarGroup", () => {
  it("支持 size 和 shape 透传给未显式声明的头像", () => {
    const wrapper = mountAvatar(XyAvatarGroup, {
      slots: {
        default: `
          <xy-avatar>甲</xy-avatar>
          <xy-avatar size="lg" shape="circle">乙</xy-avatar>
          <xy-avatar>丙</xy-avatar>
        `
      },
      props: {
        size: "sm",
        shape: "square"
      },
      global: {
        components: {
          XyAvatar
        }
      }
    });

    const avatars = wrapper.findAll(".xy-avatar");
    expect(avatars[0]?.classes()).toContain("xy-avatar--sm");
    expect(avatars[0]?.classes()).toContain("xy-avatar--square");
    expect(avatars[1]?.classes()).toContain("xy-avatar--lg");
    expect(avatars[1]?.classes()).toContain("xy-avatar--circle");
    expect(avatars[2]?.classes()).toContain("xy-avatar--sm");
    expect(avatars[2]?.classes()).toContain("xy-avatar--square");
  });

  it("支持折叠显示多余头像", () => {
    const wrapper = mountAvatar(XyAvatarGroup, {
      props: {
        collapseAvatars: true,
        maxCollapseAvatars: 2
      },
      slots: {
        default: `
          <xy-avatar>甲</xy-avatar>
          <xy-avatar>乙</xy-avatar>
          <xy-avatar>丙</xy-avatar>
          <xy-avatar>丁</xy-avatar>
        `
      },
      global: {
        components: {
          XyAvatar
        }
      }
    });

    const avatars = wrapper.findAll(".xy-avatar");
    expect(avatars).toHaveLength(3);
    expect(avatars[2]?.text()).toBe("+2");
  });

  it("支持折叠头像 tooltip 展示隐藏项", async () => {
    vi.useFakeTimers();

    const wrapper = mountAvatar(XyAvatarGroup, {
      attachTo: document.body,
      props: {
        collapseAvatars: true,
        collapseAvatarsTooltip: true,
        maxCollapseAvatars: 1
      },
      slots: {
        default: `
          <xy-avatar>甲</xy-avatar>
          <xy-avatar>乙</xy-avatar>
          <xy-avatar>丙</xy-avatar>
        `
      },
      global: {
        components: {
          XyAvatar
        }
      }
    });

    await wrapper.find(".xy-tooltip").trigger("mouseenter");
    vi.runAllTimers();
    await Promise.resolve();
    await nextTick();

    expect(document.body.querySelector(".xy-avatar-group__collapse-avatars")).not.toBeNull();
    expect(document.body.querySelectorAll(".xy-avatar-group__collapse-avatars .xy-avatar")).toHaveLength(2);
  });
});
