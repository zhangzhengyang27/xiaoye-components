import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyPagination } from "../index";

enableAutoUnmount(afterEach);

describe("XyPagination", () => {
  it("支持基础页码切换和省略号", async () => {
    const wrapper = mount(XyPagination, {
      props: {
        currentPage: 5,
        total: 200,
        pageSize: 10
      }
    });

    const pagerItems = wrapper.findAll(".xy-pagination__pager-item");
    expect(pagerItems.some((item) => item.text() === "…")).toBe(true);

    const pageSix = pagerItems.find((item) => item.text() === "6");
    await pageSix?.trigger("click");

    expect(wrapper.emitted("update:currentPage")?.[0]).toEqual([6]);
    expect(wrapper.emitted("current-change")?.[0]).toEqual([6]);
    expect(wrapper.emitted("change")?.[0]).toEqual([6, 10]);
  });

  it("支持 prev / next 点击事件", async () => {
    const wrapper = mount(XyPagination, {
      props: {
        currentPage: 3,
        total: 100,
        pageSize: 10
      }
    });

    const buttons = wrapper.findAll(".xy-pagination__button");
    await buttons[0]?.trigger("click");
    await buttons[1]?.trigger("click");

    expect(wrapper.emitted("prev-click")?.[0]).toEqual([2]);
    expect(wrapper.emitted("next-click")?.[0]).toEqual([4]);
  });

  it("支持 pageSize 切换并自动校正当前页", async () => {
    const wrapper = mount(XyPagination, {
      attachTo: document.body,
      props: {
        currentPage: 10,
        pageSize: 10,
        total: 95,
        layout: "sizes, prev, pager, next"
      }
    });

    await wrapper.get(".xy-select__trigger").trigger("click");
    await nextTick();

    const options = [...document.body.querySelectorAll(".xy-select__option")];
    const target = options.find((option) => option.textContent?.includes("50 条")) as HTMLElement | undefined;
    target?.click();
    await nextTick();

    expect(wrapper.emitted("update:pageSize")?.[0]).toEqual([50]);
    expect(wrapper.emitted("size-change")?.[0]).toEqual([50]);
    expect(wrapper.emitted("update:currentPage")?.[0]).toEqual([2]);
    expect(wrapper.emitted("change")?.[0]).toEqual([2, 50]);
  });

  it("支持 teleported、appendSizeTo 和 popperClass", async () => {
    document.body.innerHTML = `<div id="pagination-size-target"></div>`;

    mount(XyPagination, {
      attachTo: document.body,
      props: {
        total: 100,
        layout: "sizes",
        teleported: true,
        appendSizeTo: "#pagination-size-target",
        popperClass: "pagination-size-popper"
      }
    });

    const trigger = document.body.querySelector(".xy-select__trigger") as HTMLElement | null;
    trigger?.click();
    await nextTick();

    const popper = document.querySelector("#pagination-size-target .pagination-size-popper") as HTMLElement | null;
    expect(popper).not.toBeNull();
  });

  it("支持 layout、slot 和 hideOnSinglePage", () => {
    const wrapper = mount(XyPagination, {
      props: {
        total: 10,
        pageSize: 10,
        hideOnSinglePage: true
      },
      slots: {
        default: "<span class='slot-content'>slot</span>"
      }
    });

    expect(wrapper.find(".xy-pagination").exists()).toBe(false);

    const visibleWrapper = mount(XyPagination, {
      props: {
        total: 100,
        layout: "slot, ->, total, jumper",
        currentPage: 2
      },
      slots: {
        default: "<span class='slot-content'>slot</span>"
      }
    });

    expect(visibleWrapper.find(".slot-content").exists()).toBe(true);
    expect(visibleWrapper.find(".xy-pagination__right .xy-pagination__total").exists()).toBe(true);
    expect(visibleWrapper.find(".xy-pagination__right .xy-pagination__jumper").exists()).toBe(true);
  });

  it("支持 pageCount、background 和 disabled", async () => {
    const wrapper = mount(XyPagination, {
      props: {
        pageCount: 5,
        currentPage: 1,
        background: true,
        disabled: true
      }
    });

    expect(wrapper.classes()).toContain("is-background");
    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.findAll(".xy-pagination__pager-item")).toHaveLength(5);

    await wrapper.find(".xy-pagination__button--next").trigger("click");
    expect(wrapper.emitted()).toEqual({});
  });

  it("支持默认值和 jumper", async () => {
    const Demo = defineComponent({
      components: { XyPagination },
      setup() {
        const current = ref<number | undefined>(undefined);
        return {
          current
        };
      },
      template: `
        <xy-pagination
          v-model:current-page="current"
          :default-current-page="3"
          :total="100"
          layout="prev, pager, next, jumper"
        />
      `
    });

    const wrapper = mount(Demo);
    const jumper = wrapper.get(".xy-pagination__jumper input");
    expect((jumper.element as HTMLInputElement).value).toBe("3");

    await jumper.setValue("6");
    await jumper.trigger("change");
    await nextTick();

    expect(wrapper.findComponent(XyPagination).emitted("update:currentPage")?.[0]).toEqual([6]);
  });
});
