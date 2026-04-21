import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick, provide, ref } from "vue";

describe("Headless Components", () => {
  describe("TransitionRoot", () => {
    it("provides transition context", async () => {
      const { TransitionRoot } = await import("../src/headless/transition/transition-root.vue");
      const wrapper = mount(TransitionRoot, {
        props: { show: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.show).toBeDefined();
      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
    });
  });

  describe("TransitionChild", () => {
    it("renders with show prop", async () => {
      const { TransitionChild } = await import("../src/headless/transition/transition-child.vue");
      const wrapper = mount(TransitionChild, {
        props: { show: true },
        global: {
          stubs: {}
        }
      });

      await nextTick();
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Dialog", () => {
    it("DialogRoot provides context", async () => {
      const { DialogRoot } = await import("../src/headless/dialog/dialog-root.vue");
      const wrapper = mount(DialogRoot, {
        props: { open: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
    });

    it("DialogPanel renders", async () => {
      const { DialogPanel } = await import("../src/headless/dialog/dialog-panel.vue");
      const wrapper = mount(DialogPanel, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("DialogTitle renders", async () => {
      const { DialogTitle } = await import("../src/headless/dialog/dialog-title.vue");
      const wrapper = mount(DialogTitle, {
        slots: { default: () => "Test Title" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Test Title");
    });

    it("DialogDescription renders", async () => {
      const { DialogDescription } = await import("../src/headless/dialog/dialog-description.vue");
      const wrapper = mount(DialogDescription, {
        slots: { default: () => "Test Description" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Test Description");
    });
  });

  describe("Menu", () => {
    it("MenuRoot provides context", async () => {
      const { MenuRoot } = await import("../src/headless/menu/menu-root.vue");
      const wrapper = mount(MenuRoot, {
        props: { open: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
      expect(wrapper.vm.toggle).toBeDefined();
    });

    it("MenuButton renders", async () => {
      const { MenuButton } = await import("../src/headless/menu/menu-button.vue");
      const wrapper = mount(MenuButton, {
        slots: { default: () => "Menu" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Menu");
    });

    it("MenuItems renders with isOpen context", async () => {
      const { MenuItems } = await import("../src/headless/menu/menu-items.vue");
      const wrapper = mount(MenuItems, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("MenuItem renders with slot props", async () => {
      const { MenuItem } = await import("../src/headless/menu/menu-item.vue");
      const wrapper = mount(MenuItem, {
        props: { disabled: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Listbox", () => {
    it("ListboxRoot provides context", async () => {
      const { ListboxRoot } = await import("../src/headless/listbox/listbox-root.vue");
      const wrapper = mount(ListboxRoot, {
        props: { options: [{ value: "1", label: "Option 1" }] },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
    });

    it("ListboxButton renders", async () => {
      const { ListboxButton } = await import("../src/headless/listbox/listbox-button.vue");
      const wrapper = mount(ListboxButton, {
        slots: { default: () => "Select" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Select");
    });

    it("ListboxOptions renders", async () => {
      const { ListboxOptions } = await import("../src/headless/listbox/listbox-options.vue");
      const wrapper = mount(ListboxOptions, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("ListboxOption renders with slot props", async () => {
      const { ListboxOption } = await import("../src/headless/listbox/listbox-option.vue");
      const wrapper = mount(ListboxOption, {
        props: { value: "1", disabled: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Disclosure", () => {
    it("DisclosureRoot provides context", async () => {
      const { DisclosureRoot } = await import("../src/headless/disclosure/disclosure-root.vue");
      const wrapper = mount(DisclosureRoot, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.toggle).toBeDefined();
      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
    });

    it("DisclosureButton renders", async () => {
      const { DisclosureButton } = await import("../src/headless/disclosure/disclosure-button.vue");
      const wrapper = mount(DisclosureButton, {
        slots: { default: () => "Click to expand" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Click to expand");
    });

    it("DisclosurePanel renders", async () => {
      const { DisclosurePanel } = await import("../src/headless/disclosure/disclosure-panel.vue");
      const wrapper = mount(DisclosurePanel, {
        slots: { default: () => "Panel content" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Tabs", () => {
    it("TabGroup provides context", async () => {
      const { TabGroup } = await import("../src/headless/tabs/tab-group.vue");
      const wrapper = mount(TabGroup, {
        props: { selectedIndex: 0 },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.selectTab).toBeDefined();
    });

    it("TabList renders", async () => {
      const { TabList } = await import("../src/headless/tabs/tab-list.vue");
      const wrapper = mount(TabList, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("Tab renders with slot", async () => {
      const { Tab } = await import("../src/headless/tabs/tab.vue");
      const wrapper = mount(Tab, {
        slots: { default: () => "Tab 1" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Tab 1");
    });

    it("TabPanels renders", async () => {
      const { TabPanels } = await import("../src/headless/tabs/tab-panels.vue");
      const wrapper = mount(TabPanels, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("TabPanel renders", async () => {
      const { TabPanel } = await import("../src/headless/tabs/tab-panel.vue");
      const wrapper = mount(TabPanel, {
        slots: { default: () => "Panel content" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Popover", () => {
    it("PopoverRoot provides context", async () => {
      const { PopoverRoot } = await import("../src/headless/popover/popover-root.vue");
      const wrapper = mount(PopoverRoot, {
        props: { open: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.open).toBeDefined();
      expect(wrapper.vm.close).toBeDefined();
      expect(wrapper.vm.toggle).toBeDefined();
    });

    it("PopoverButton renders", async () => {
      const { PopoverButton } = await import("../src/headless/popover/popover-button.vue");
      const wrapper = mount(PopoverButton, {
        slots: { default: () => "Popover" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Popover");
    });

    it("PopoverPanel renders", async () => {
      const { PopoverPanel } = await import("../src/headless/popover/popover-panel.vue");
      const wrapper = mount(PopoverPanel, {
        slots: { default: () => "Panel content" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("PopoverHeading renders", async () => {
      const { PopoverHeading } = await import("../src/headless/popover/popover-heading.vue");
      const wrapper = mount(PopoverHeading, {
        slots: { default: () => "Heading" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Heading");
    });
  });

  describe("Switch", () => {
    it("SwitchGroup renders", async () => {
      const { SwitchGroup } = await import("../src/headless/switch/switch-group.vue");
      const wrapper = mount(SwitchGroup, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("SwitchLabel renders", async () => {
      const { SwitchLabel } = await import("../src/headless/switch/switch-label.vue");
      const wrapper = mount(SwitchLabel, {
        slots: { default: () => "Enable notifications" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Enable notifications");
    });

    it("SwitchDescription renders", async () => {
      const { SwitchDescription } = await import("../src/headless/switch/switch-description.vue");
      const wrapper = mount(SwitchDescription, {
        slots: { default: () => "Receive push notifications" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Receive push notifications");
    });
  });

  describe("RadioGroup", () => {
    it("RadioGroupRoot provides context", async () => {
      const { RadioGroupRoot } = await import("../src/headless/radio-group/radio-group-root.vue");
      const wrapper = mount(RadioGroupRoot, {
        props: {
          options: [{ value: "1", label: "Option 1" }]
        },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.vm.selectOption).toBeDefined();
    });

    it("RadioGroupLabel renders", async () => {
      const { RadioGroupLabel } = await import("../src/headless/radio-group/radio-group-label.vue");
      const wrapper = mount(RadioGroupLabel, {
        slots: { default: () => "Select Plan" },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.text()).toContain("Select Plan");
    });

    it("RadioGroupOption renders with slot props", async () => {
      const { RadioGroupOption } = await import("../src/headless/radio-group/radio-group-option.vue");
      const wrapper = mount(RadioGroupOption, {
        props: { value: "1", disabled: false },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Combobox", () => {
    it("ComboboxRoot renders", async () => {
      const { ComboboxRoot } = await import("../src/headless/combobox/combobox-root.vue");
      const wrapper = mount(ComboboxRoot, {
        props: {
          options: [{ value: "1", label: "Option 1" }]
        },
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("ComboboxInput renders", async () => {
      const { ComboboxInput } = await import("../src/headless/combobox/combobox-input.vue");
      const wrapper = mount(ComboboxInput, {
        global: {
          stubs: {}
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });
});
