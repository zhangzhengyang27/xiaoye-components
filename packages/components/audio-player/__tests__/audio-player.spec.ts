import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyAudioPlayer } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
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

const howlMock = vi.hoisted(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  seek: vi.fn(() => 12),
  volume: vi.fn(),
  unload: vi.fn(),
  rate: vi.fn(),
  duration: vi.fn(() => 120),
  playing: vi.fn(() => false),
  constructor: vi.fn(function MockHowl(options: Record<string, (...args: unknown[]) => void>) {
    options.onload?.();
    return {
      play: howlMock.play.mockImplementation(() => {
        options.onplay?.();
      }),
      pause: howlMock.pause.mockImplementation(() => {
        options.onpause?.();
      }),
      stop: howlMock.stop,
      seek: howlMock.seek,
      volume: howlMock.volume,
      unload: howlMock.unload,
      rate: howlMock.rate,
      duration: howlMock.duration,
      playing: howlMock.playing
    };
  })
}));

vi.mock("howler", () => ({
  Howl: howlMock.constructor
}));

describe("XyAudioPlayer", () => {
  it("会根据 src 初始化音频实例，并支持播放与暂停", async () => {
    const wrapper = mount(XyAudioPlayer, {
      props: {
        src: "/demo.mp3"
      }
    });

    await nextTick();
    await Promise.resolve();

    expect(howlMock.constructor).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("init")).toHaveLength(1);

    await wrapper.get(".xy-button--primary").trigger("click");
    expect(howlMock.play).toHaveBeenCalled();
    expect(wrapper.emitted("play")).toHaveLength(1);

    howlMock.playing.mockReturnValue(true);
    await wrapper.setProps({
      src: "/demo.mp3?next=1"
    });

    expect(howlMock.unload).toHaveBeenCalled();
  });

  it("暴露音量更新和卸载清理", async () => {
    const wrapper = mount(XyAudioPlayer, {
      props: {
        src: "/demo.mp3",
        volume: 0.5
      }
    });

    await wrapper.setProps({
      volume: 0.8
    });

    expect(howlMock.volume).toHaveBeenCalledWith(0.8);

    wrapper.unmount();

    expect(howlMock.unload).toHaveBeenCalled();
  });
});
