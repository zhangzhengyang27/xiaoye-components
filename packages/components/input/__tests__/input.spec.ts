import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyInput } from "@xiaoye/components";

describe("XyInput", () => {
  it("响应 v-model 更新", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: ""
      }
    });

    await wrapper.find("input").setValue("hello");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["hello"]);
  });
});

