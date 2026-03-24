import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XySelect } from "@xiaoye/components";

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

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
});

const mountedWrappers: VueWrapper[] = [];

function mountSelect(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

describe("XySelect", () => {
  it("可以选择选项并发出 change 事件", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    const options = document.body.querySelectorAll(".xy-select__option");
    const secondOption = options[1] as HTMLButtonElement | undefined;

    secondOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["member"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["member"]);
  });

  it("支持键盘选择高亮项", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    const trigger = wrapper.find(".xy-select__trigger");

    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["member"]);
  });

  it("支持搜索无匹配文案和清空已选值", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        modelValue: "admin",
        searchable: true,
        clearable: true,
        noMatchText: "没有结果",
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    const searchInput = document.body.querySelector(
      ".xy-select__search input"
    ) as HTMLInputElement | null;

    if (!searchInput) {
      throw new Error("missing search input");
    }

    searchInput.value = "zzz";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await nextTick();

    expect(document.body.textContent).toContain("没有结果");

    await wrapper.find(".xy-select__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
    expect(wrapper.emitted("clear")).toBeTruthy();
  });

  it("支持分组选项和组选禁用透传", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          {
            label: "系统角色",
            options: [
              { label: "管理员", value: "admin" },
              { label: "访客", value: "guest" }
            ]
          },
          {
            label: "业务角色",
            disabled: true,
            options: [{ label: "财务", value: "finance" }]
          }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");

    expect(document.body.textContent).toContain("系统角色");
    expect(document.body.textContent).toContain("业务角色");

    const options = document.body.querySelectorAll(".xy-select__option");
    expect((options[2] as HTMLButtonElement | undefined)?.disabled).toBe(true);
  });

  it("支持 header/footer/loading/empty 和 option 插槽", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        loading: true,
        options: [{ label: "管理员", value: "admin", description: "desc" }]
      },
      slots: {
        header: "<div class='header-slot'>header</div>",
        footer: "<div class='footer-slot'>footer</div>",
        loading: "<div class='loading-slot'>loading</div>",
        empty: "<div class='empty-slot'>empty</div>",
        option: `
          <template #option="{ option }">
            <span class="custom-option">{{ option.label }}</span>
          </template>
        `
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    expect(document.body.querySelector(".header-slot")).not.toBeNull();
    expect(document.body.querySelector(".footer-slot")).not.toBeNull();
    expect(document.body.querySelector(".loading-slot")).not.toBeNull();

    await wrapper.setProps({
      loading: false,
      options: []
    });
    await nextTick();

    expect(document.body.querySelector(".empty-slot")).not.toBeNull();

    await wrapper.setProps({
      options: [{ label: "成员", value: "member" }]
    });
    await nextTick();

    expect(document.body.querySelector(".custom-option")).not.toBeNull();
  });

  it("支持前缀图标和暴露方法", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        prefixIcon: "mdi:magnify",
        options: [{ label: "管理员", value: "admin" }]
      }
    });

    const api = wrapper.vm as unknown as {
      focus: () => void;
      blur: () => Promise<void>;
      open: () => Promise<void>;
      close: () => Promise<void>;
    };

    expect(wrapper.find('[data-icon="mdi:magnify"]').exists()).toBe(true);

    api.focus();
    await api.open();

    expect(document.body.querySelector(".xy-select__dropdown")).not.toBeNull();

    await api.close();
    await nextTick();
    expect(document.body.querySelector(".xy-select__dropdown")).toBeNull();
  });

  it("支持关闭 teleport 后在本地容器内渲染下拉", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        teleported: false,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    expect(wrapper.find(".xy-select__dropdown").exists()).toBe(true);
    expect(wrapper.element.querySelector(".xy-select__dropdown")).not.toBeNull();
  });

  it("支持通过 dropdownMaxWidth 控制下拉面板最大宽度", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        dropdownMaxWidth: 260,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    const dropdown = document.body.querySelector(".xy-select__dropdown") as HTMLElement | null;

    expect(dropdown).not.toBeNull();
    expect(dropdown?.style.maxWidth).toBe("260px");
  });

  it("支持通过 dropdownMinWidth 控制下拉面板最小宽度", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        dropdownMinWidth: 320,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    const dropdown = document.body.querySelector(".xy-select__dropdown") as HTMLElement | null;

    expect(dropdown).not.toBeNull();
    expect(dropdown?.style.minWidth).toBe("320px");
  });

  it("支持关闭 fitInputWidth 后不强制跟随触发器宽度", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        fitInputWidth: false,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    const dropdown = document.body.querySelector(".xy-select__dropdown") as HTMLElement | null;

    expect(dropdown).not.toBeNull();
    expect(dropdown?.style.width).toBe("");
  });

  it("支持通过 appendTo 指定 dropdown 挂载目标", async () => {
    const host = document.createElement("div");
    host.id = "select-host";
    document.body.appendChild(host);

    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        appendTo: "#select-host",
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    expect(host.querySelector(".xy-select__dropdown")).not.toBeNull();
  });

  it("下拉面板带有箭头标识和实际 placement 属性", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();
    await nextTick();

    const dropdown = document.body.querySelector(".xy-select__dropdown") as HTMLElement | null;

    expect(dropdown).not.toBeNull();
    expect(dropdown?.querySelector(".xy-popper__arrow")).not.toBeNull();
    expect(dropdown?.getAttribute("data-placement")).toContain("bottom");
  });

  it("支持 placement / offset / popperClass / popperStyle", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        placement: "top-start",
        offset: 16,
        popperClass: "custom-popper",
        popperStyle: {
          borderColor: "rgb(29, 78, 216)"
        },
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    await nextTick();

    const dropdown = document.body.querySelector(".xy-select__dropdown") as HTMLElement | null;

    expect(dropdown).not.toBeNull();
    expect(dropdown?.classList.contains("custom-popper")).toBe(true);
    expect(dropdown?.style.borderColor).toBe("rgb(29, 78, 216)");
  });

  it("在可搜索模式下支持键盘关闭下拉", async () => {
    const wrapper = mountSelect(XySelect, {
      attachTo: document.body,
      props: {
        searchable: true,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" },
          { label: "访客", value: "guest" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");

    const searchInput = document.body.querySelector(
      ".xy-select__search input"
    ) as HTMLInputElement | null;

    if (!searchInput) {
      throw new Error("missing search input");
    }

    searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    await nextTick();

    expect(document.body.querySelector(".xy-select__dropdown")).toBeNull();
    expect(wrapper.emitted("blur")).toBeTruthy();
  });
});
