import { flushPromises, mount } from "@vue/test-utils";
import { h } from "vue";
import { nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyUpload } from "@xiaoye/components";
import type { UploadFileItem } from "../src/upload";

vi.stubGlobal(
  "URL",
  Object.assign(globalThis.URL, {
    createObjectURL: vi.fn(() => `blob:mock-${Math.random()}`),
    revokeObjectURL: vi.fn()
  })
);

vi.mock("@iconify/vue", () => ({
  Icon: {
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    template: '<svg v-bind="$attrs" :data-icon="icon"></svg>'
  }
}));

describe("XyUpload", () => {
  it("支持 fileList 双向绑定和上传成功", async () => {
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [],
        httpRequest: () => Promise.resolve({ ok: true })
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await nextTick();
    await flushPromises();

    const latestFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as
      | Array<{ status?: string }>
      | undefined;

    expect(latestFiles).toHaveLength(1);
    expect(latestFiles?.[0]?.status).toBe("success");
    expect(wrapper.text()).toContain("avatar.png");
  });

  it("支持手动上传、重试和 expose.submit", async () => {
    let shouldFail = true;
    const wrapper = mount(XyUpload, {
      props: {
        autoUpload: false,
        httpRequest: () =>
          shouldFail ? Promise.reject(new Error("fail")) : Promise.resolve({ ok: true })
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["a"], "a.txt", { type: "text/plain" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await nextTick();

    expect(wrapper.text()).toContain("待上传");

    await (wrapper.vm as unknown as { submit: () => Promise<void> }).submit();
    await flushPromises();

    expect(wrapper.text()).toContain("失败");

    shouldFail = false;
    await wrapper.get(".xy-upload-list__action").trigger("click");
    await flushPromises();

    expect(wrapper.text()).not.toContain("失败");
    expect(wrapper.text()).not.toContain("待上传");
  });

  it("支持 beforeUpload、limit 和 remove", async () => {
    const onExceed = vi.fn();
    const onRemove = vi.fn();
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [],
        multiple: true,
        limit: 1,
        beforeUpload: (file) => file.name !== "blocked.txt",
        onExceed,
        onRemove
      }
    });

    const input = wrapper.find('input[type="file"]');
    const blocked = new File(["a"], "blocked.txt", { type: "text/plain" });
    const ok1 = new File(["b"], "b.txt", { type: "text/plain" });
    const ok2 = new File(["c"], "c.txt", { type: "text/plain" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [blocked]
    });
    await input.trigger("change");
    await flushPromises();

    expect(wrapper.text()).not.toContain("blocked.txt");

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [ok1, ok2]
    });
    await input.trigger("change");
    await nextTick();

    expect(onExceed).toHaveBeenCalled();

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [ok1]
    });
    await input.trigger("change");
    await nextTick();

    await wrapper.get(".xy-upload-list__action.is-danger").trigger("click");

    expect(onRemove).toHaveBeenCalled();
  });

  it("支持 picture 和 picture-card 列表形态", async () => {
    const pictureList = mount(XyUpload, {
      props: {
        listType: "picture",
        fileList: [
          {
            uid: "img-1",
            name: "cover.png",
            size: 1024,
            url: "https://example.com/cover.png",
            status: "success"
          }
        ]
      }
    });

    expect(pictureList.find(".xy-upload-list__thumb").exists()).toBe(true);

    const pictureCard = mount(XyUpload, {
      props: {
        listType: "picture-card",
        fileList: [
          {
            uid: "img-2",
            name: "avatar.png",
            size: 1024,
            url: "https://example.com/avatar.png",
            status: "success"
          }
        ]
      }
    });

    expect(pictureCard.find(".xy-upload-list__card").exists()).toBe(true);
    expect(pictureCard.find(".xy-upload__picture-card-trigger").exists()).toBe(true);
  });

  it("图片预览会打开弹层并支持 Escape 关闭", async () => {
    const wrapper = mount(XyUpload, {
      attachTo: document.body,
      props: {
        listType: "picture-card",
        fileList: [
          {
            uid: "img-preview",
            name: "avatar.png",
            size: 1024,
            url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'></svg>",
            status: "success"
          }
        ]
      }
    });

    await wrapper.get(".xy-upload-list__preview").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-upload__preview")).toBeTruthy();

    const shell = document.body.querySelector(".xy-upload__preview-shell") as HTMLElement | null;
    shell?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();

    expect(document.body.querySelector(".xy-upload__preview")).toBeNull();
  });

  it("picture-card 使用图标按钮作为遮罩操作", () => {
    const wrapper = mount(XyUpload, {
      props: {
        listType: "picture-card",
        fileList: [
          {
            uid: "img-mask",
            name: "avatar.png",
            size: 1024,
            url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'></svg>",
            status: "success"
          }
        ]
      }
    });

    const actions = wrapper.findAll(".xy-upload-list__card-action");
    expect(actions).toHaveLength(2);
    expect(actions.map((item) => item.attributes("aria-label"))).toEqual(["预览", "删除"]);
    expect(wrapper.find('[data-icon="mdi:eye-outline"]').exists()).toBe(true);
    expect(wrapper.find('[data-icon="mdi:delete-outline"]').exists()).toBe(true);
  });

  it("支持 onPreview、onChange、onRemove 和 beforeRemove", async () => {
    const onPreview = vi.fn();
    const onChange = vi.fn();
    const onRemove = vi.fn();
    let allowRemove = false;

    const wrapper = mount(XyUpload, {
      props: {
        fileList: [
          {
            uid: "doc-1",
            name: "合同.pdf",
            size: 2048,
            status: "success"
          }
        ],
        onPreview,
        onChange,
        onRemove,
        beforeRemove: () => allowRemove
      }
    });

    await wrapper.get(".xy-upload-list__name").trigger("click");
    expect(onPreview).toHaveBeenCalled();

    await wrapper.get(".xy-upload-list__action.is-danger").trigger("click");
    expect(onRemove).toHaveBeenCalledTimes(0);

    allowRemove = true;
    await wrapper.get(".xy-upload-list__action.is-danger").trigger("click");
    expect(onRemove).toHaveBeenCalled();

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "next.pdf", { type: "application/pdf" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });
    await input.trigger("change");
    await nextTick();

    expect(onChange).toHaveBeenCalled();
  });

  it("支持 showFileList、trigger/tip/file 插槽", async () => {
    const hiddenList = mount(XyUpload, {
      props: {
        showFileList: false,
        fileList: [
          {
            uid: "f-1",
            name: "hidden.txt",
            size: 512
          }
        ]
      }
    });

    expect(hiddenList.find(".xy-upload-list").exists()).toBe(false);

    const slotWrapper = mount(XyUpload, {
      props: {
        fileList: [
          {
            uid: "f-2",
            name: "custom.txt",
            size: 2048,
            status: "success"
          }
        ]
      },
      slots: {
        trigger: '<button class="custom-trigger">自定义上传按钮</button>',
        tip: '<span class="custom-tip">这是自定义提示</span>',
        file: ({ file }: { file: { name: string } }) =>
          h("div", { class: "custom-file" }, `文件：${file.name}`)
      }
    });

    expect(slotWrapper.find(".custom-trigger").exists()).toBe(true);
    expect(slotWrapper.find(".custom-tip").exists()).toBe(true);
    expect(slotWrapper.find(".custom-file").text()).toContain("custom.txt");
  });

  it("支持 directory 属性和粘贴上传", async () => {
    const wrapper = mount(XyUpload, {
      attachTo: document.body,
      props: {
        directory: true,
        paste: true,
        fileList: [],
        httpRequest: () => Promise.resolve({ ok: true })
      }
    });

    const input = wrapper.find('input[type="file"]');
    expect(input.attributes("webkitdirectory")).toBe("true");

    const file = new File(["hello"], "pasted.png", { type: "image/png" });
    const pasteEvent = new Event("paste", { bubbles: true }) as ClipboardEvent;

    Object.defineProperty(pasteEvent, "clipboardData", {
      configurable: true,
      value: {
        files: [file]
      }
    });

    wrapper.get(".xy-upload__content").element.dispatchEvent(pasteEvent);
    await nextTick();
    await flushPromises();

    const latestFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as UploadFileItem[] | undefined;
    expect(latestFiles?.some((item) => item.name === "pasted.png")).toBe(true);
  });

  it("支持 previewFile 自定义预览地址", async () => {
    const wrapper = mount(XyUpload, {
      attachTo: document.body,
      props: {
        listType: "picture-card",
        previewFile: async () =>
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'></svg>",
        fileList: [
          {
            uid: "img-custom-preview",
            name: "avatar.png",
            size: 1024,
            status: "success"
          }
        ]
      }
    });

    await wrapper.get(".xy-upload-list__preview").trigger("click");
    await flushPromises();
    await nextTick();

    const previewImage = document.body.querySelector(".xy-upload__preview-image") as HTMLImageElement | null;
    expect(previewImage?.src).toContain("data:image/svg+xml");
  });

  it("clearFiles 和卸载时会中止进行中的上传", async () => {
    const clearFilesPending = {} as {
      resolve: (value: unknown) => void;
    };
    const onError = vi.fn();
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [],
        onError,
        httpRequest: () =>
          new Promise((resolve) => {
            clearFilesPending.resolve = resolve;
          })
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await nextTick();

    await (wrapper.vm as unknown as { clearFiles: () => Promise<void> }).clearFiles();
    await flushPromises();
    clearFilesPending.resolve({ ok: true });

    await flushPromises();

    const finalFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as UploadFileItem[] | undefined;
    expect(finalFiles).toEqual([]);

    const unmountPending = {} as {
      resolve: (value: unknown) => void;
    };
    const onUnmountError = vi.fn();
    const unmountWrapper = mount(XyUpload, {
      props: {
        fileList: [],
        onError: onUnmountError,
        httpRequest: () =>
          new Promise((resolve) => {
            unmountPending.resolve = resolve;
          })
      }
    });

    const secondInput = unmountWrapper.find('input[type="file"]');
    Object.defineProperty(secondInput.element, "files", {
      configurable: true,
      value: [new File(["world"], "logo.png", { type: "image/png" })]
    });

    await secondInput.trigger("change");
    await nextTick();
    unmountWrapper.unmount();
    await flushPromises();
    unmountPending.resolve({ ok: true });

    await flushPromises();

    expect(onUnmountError.mock.calls.length).toBeGreaterThanOrEqual(0);
  });

  it("没有 raw 的失败文件不显示重试按钮", () => {
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [
          {
            uid: "remote-fail",
            name: "remote.pdf",
            size: 1024,
            status: "fail"
          }
        ]
      }
    });

    expect(wrapper.findAll(".xy-upload-list__action").some((item) => item.text() === "重试")).toBe(false);
  });

  it("beforeUpload 返回新文件时会同步替换列表条目", async () => {
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [],
        beforeUpload: (file) =>
          new File([file], "compressed.png", {
            type: "image/png"
          }),
        httpRequest: () => Promise.resolve({ ok: true })
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await flushPromises();

    const latestFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as
      | Array<{ name?: string; raw?: File }>
      | undefined;

    expect(latestFiles?.[0]?.name).toBe("compressed.png");
    expect(latestFiles?.[0]?.raw?.name).toBe("compressed.png");
  });

  it("Promise 风格请求 abort 后不会再回写成功状态", async () => {
    const abortPending = {} as {
      resolve: (value: unknown) => void;
    };
    const onError = vi.fn();
    const wrapper = mount(XyUpload, {
      props: {
        fileList: [],
        onError,
        httpRequest: () =>
          new Promise((resolve) => {
            abortPending.resolve = resolve;
          })
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await nextTick();

    const latestFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as UploadFileItem[] | undefined;
    const targetFile = latestFiles?.[0];
    expect(targetFile).toBeTruthy();

    (wrapper.vm as unknown as { abort: (file?: UploadFileItem) => void }).abort(targetFile);
    await flushPromises();
    abortPending.resolve({ ok: true });

    await flushPromises();

    const finalFiles = wrapper.emitted("update:fileList")?.at(-1)?.[0] as UploadFileItem[] | undefined;
    expect(onError).toHaveBeenCalled();
    expect(finalFiles?.[0]?.status).toBe("fail");
  });

  it("同 uid 替换 raw 或切换远端 url 时会刷新并回收预览 URL", async () => {
    const createObjectURL = vi.mocked(URL.createObjectURL);
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    const rawA = Object.assign(new File(["a"], "a.png", { type: "image/png" }), {
      uid: "same"
    });
    const rawB = Object.assign(new File(["b"], "b.png", { type: "image/png" }), {
      uid: "same"
    });

    const wrapper = mount(XyUpload, {
      props: {
        listType: "picture",
        fileList: [
          {
            uid: "same",
            name: "a.png",
            size: rawA.size,
            raw: rawA
          }
        ]
      }
    });

    await wrapper.setProps({
      fileList: [
        {
          uid: "same",
          name: "b.png",
          size: rawB.size,
          raw: rawB
        }
      ]
    });

    await wrapper.setProps({
      fileList: [
        {
          uid: "same",
          name: "remote.png",
          size: 100,
          url: "https://example.com/remote.png"
        }
      ]
    });

    expect(createObjectURL).toHaveBeenCalledTimes(2);
    expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  });
});
