import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { XyVideoPlayer } from "@xiaoye/components";

const videoMock = vi.hoisted(() => ({
  on: vi.fn(),
  src: vi.fn(),
  load: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  dispose: vi.fn(),
  constructor: vi.fn(() => ({
    on: videoMock.on,
    src: videoMock.src,
    load: videoMock.load,
    play: videoMock.play,
    pause: videoMock.pause,
    dispose: videoMock.dispose
  }))
}));

vi.mock("video.js", () => ({
  default: videoMock.constructor
}));

describe("XyVideoPlayer", () => {
  it("挂载时初始化 player，并转发基本事件绑定", () => {
    const wrapper = mount(XyVideoPlayer, {
      props: {
        sources: [{ src: "/demo.mp4", type: "video/mp4" }]
      }
    });

    expect(videoMock.constructor).toHaveBeenCalledTimes(1);
    expect(videoMock.on).toHaveBeenCalled();
    expect(wrapper.emitted("init")).toHaveLength(1);
  });

  it("sources 变化会重建播放器，卸载时销毁实例", async () => {
    const wrapper = mount(XyVideoPlayer, {
      props: {
        sources: [{ src: "/demo.mp4", type: "video/mp4" }]
      }
    });

    await wrapper.setProps({
      sources: [{ src: "/demo-2.mp4", type: "video/mp4" }]
    });

    expect(videoMock.constructor).toHaveBeenCalledTimes(2);

    wrapper.unmount();

    expect(videoMock.dispose).toHaveBeenCalled();
  });
});
