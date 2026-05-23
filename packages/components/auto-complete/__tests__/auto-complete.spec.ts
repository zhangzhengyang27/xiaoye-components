import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { XyAutoComplete } from "@xiaoye/components";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XyAutoComplete", () => {
  it("支持输入筛选和选择建议项", async () => {
    const wrapper = mount(XyAutoComplete, {
      props: {
        modelValue: "",
        options: [
          { label: "控制台", value: 1 },
          { label: "账单中心", value: 2 }
        ]
      },
      attachTo: document.body
    });

    await wrapper.find("input").trigger("focus");
    await wrapper.find("input").setValue("账单");

    const options = Array.from(document.body.querySelectorAll(".xy-auto-complete__option"));
    expect(options).toHaveLength(1);

    await (options[0] as HTMLButtonElement).click();

    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe("账单中心");
    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ value: 2 });
  });

  it("remote 模式下会保留外部传入结果并派发 search-change", async () => {
    const wrapper = mount(XyAutoComplete, {
      props: {
        modelValue: "",
        remote: true,
        options: [{ label: "外部建议", value: 1 }]
      },
      attachTo: document.body
    });

    await wrapper.find("input").trigger("focus");
    await wrapper.find("input").setValue("abc");

    expect(wrapper.emitted("searchChange")?.at(-1)?.[0]).toBe("abc");
    expect(document.body.querySelector(".xy-auto-complete__option")?.textContent).toContain(
      "外部建议"
    );
  });

  it("支持自定义 popup 容器、类名、样式和 placement", async () => {
    const appendTarget = document.createElement("div");
    appendTarget.className = "auto-complete-target";
    document.body.appendChild(appendTarget);

    const wrapper = mount(XyAutoComplete, {
      props: {
        modelValue: "",
        options: [{ label: "控制台", value: 1 }],
        appendTo: ".auto-complete-target",
        placement: "top-start",
        popperClass: "custom-auto-complete-dropdown",
        popperStyle: {
          width: "260px"
        }
      },
      attachTo: document.body
    });

    await wrapper.find("input").trigger("focus");

    const dropdown = appendTarget.querySelector(".custom-auto-complete-dropdown") as HTMLElement | null;
    expect(dropdown).not.toBeNull();
    expect(dropdown?.classList.contains("xy-auto-complete__dropdown")).toBe(true);
    expect(dropdown?.style.width).toBe("260px");
    expect(dropdown?.getAttribute("data-placement")).toContain("top");
  });

  it("在 teleported=false 时将 dropdown 保留在当前容器内", async () => {
    const wrapper = mount(XyAutoComplete, {
      props: {
        modelValue: "",
        options: [{ label: "控制台", value: 1 }],
        teleported: false,
        popperClass: "inline-auto-complete-dropdown"
      },
      attachTo: document.body
    });

    await wrapper.find("input").trigger("focus");

    expect(wrapper.find(".inline-auto-complete-dropdown").exists()).toBe(true);
    expect(document.body.querySelector(".inline-auto-complete-dropdown")).not.toBeNull();
  });
});
