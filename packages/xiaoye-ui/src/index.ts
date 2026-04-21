import type { App } from "vue";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "./headless/tabs";
import { DialogRoot, DialogPanel, DialogTitle, DialogDescription } from "./headless/dialog";
import { MenuRoot, MenuButton, MenuItems, MenuItem } from "./headless/menu";
import { ListboxRoot, ListboxButton, ListboxOptions, ListboxOption } from "./headless/listbox";
import { ComboboxRoot, ComboboxInput } from "./headless/combobox";
import { SwitchGroup, SwitchLabel, SwitchDescription } from "./headless/switch";
import { DisclosureRoot, DisclosureButton, DisclosurePanel } from "./headless/disclosure";
import { RadioGroupRoot, RadioGroupLabel, RadioGroupOption } from "./headless/radio-group";
import { TransitionRoot, TransitionChild } from "./headless/transition";
import { PopoverRoot, PopoverButton, PopoverPanel, PopoverHeading } from "./headless/popover";
import { XyImageGallery } from "./front-components/image-gallery";
import { XyAddressPicker } from "./front-components/address-picker";
import { XyProductCard } from "./front-components/product-card";
import { XySkuSelector } from "./front-components/sku-selector";
import { XyMarketingModal } from "./front-components/marketing-modal";
import { XyuIcon } from "./front-components/icon";

export {
  // tabs
  TabGroup, TabList, Tab, TabPanels, TabPanel,
  // dialog
  DialogRoot, DialogPanel, DialogTitle, DialogDescription,
  // menu
  MenuRoot, MenuButton, MenuItems, MenuItem,
  // listbox
  ListboxRoot, ListboxButton, ListboxOptions, ListboxOption,
  // combobox
  ComboboxRoot, ComboboxInput,
  // switch
  SwitchGroup, SwitchLabel, SwitchDescription,
  // disclosure
  DisclosureRoot, DisclosureButton, DisclosurePanel,
  // radio-group
  RadioGroupRoot, RadioGroupLabel, RadioGroupOption,
  // transition
  TransitionRoot, TransitionChild,
  // popover
  PopoverRoot, PopoverButton, PopoverPanel, PopoverHeading,
  // front-components
  XyImageGallery,
  XyAddressPicker,
  XyProductCard,
  XySkuSelector,
  XyMarketingModal,
  XyuIcon,
};

const XiaoyeUI = {
  install(app: App) {
    // tabs
    app.component("XyTabGroup", TabGroup);
    app.component("XyTabList", TabList);
    app.component("XyTab", Tab);
    app.component("XyTabPanels", TabPanels);
    app.component("XyTabPanel", TabPanel);
    // dialog
    app.component("XyDialogRoot", DialogRoot);
    app.component("XyDialogPanel", DialogPanel);
    app.component("XyDialogTitle", DialogTitle);
    app.component("XyDialogDescription", DialogDescription);
    // menu
    app.component("XyMenuRoot", MenuRoot);
    app.component("XyMenuButton", MenuButton);
    app.component("XyMenuItems", MenuItems);
    app.component("XyMenuItem", MenuItem);
    // listbox
    app.component("XyListboxRoot", ListboxRoot);
    app.component("XyListboxButton", ListboxButton);
    app.component("XyListboxOptions", ListboxOptions);
    app.component("XyListboxOption", ListboxOption);
    // combobox
    app.component("XyComboboxRoot", ComboboxRoot);
    app.component("XyComboboxInput", ComboboxInput);
    // switch
    app.component("XySwitchGroup", SwitchGroup);
    app.component("XySwitchLabel", SwitchLabel);
    app.component("XySwitchDescription", SwitchDescription);
    // disclosure
    app.component("XyDisclosureRoot", DisclosureRoot);
    app.component("XyDisclosureButton", DisclosureButton);
    app.component("XyDisclosurePanel", DisclosurePanel);
    // radio-group
    app.component("XyRadioGroupRoot", RadioGroupRoot);
    app.component("XyRadioGroupLabel", RadioGroupLabel);
    app.component("XyRadioGroupOption", RadioGroupOption);
    // transition
    app.component("XyTransitionRoot", TransitionRoot);
    app.component("XyTransitionChild", TransitionChild);
    // popover
    app.component("XyPopoverRoot", PopoverRoot);
    app.component("XyPopoverButton", PopoverButton);
    app.component("XyPopoverPanel", PopoverPanel);
    app.component("XyPopoverHeading", PopoverHeading);
    // front-components
    app.component("XyImageGallery", XyImageGallery);
    app.component("XyAddressPicker", XyAddressPicker);
    app.component("XyProductCard", XyProductCard);
    app.component("XySkuSelector", XySkuSelector);
    app.component("XyMarketingModal", XyMarketingModal);
    app.component("XyuIcon", XyuIcon);
  }
};

export default XiaoyeUI;
