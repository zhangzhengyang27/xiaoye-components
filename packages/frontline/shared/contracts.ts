export const frontControlStates = ["idle", "focused", "loading", "disabled"] as const;
export const frontOverlayStates = ["open", "closed"] as const;
export const frontSelectionStates = ["active", "inactive"] as const;
export const frontValueStates = ["empty", "filled"] as const;

export type FrontControlState = (typeof frontControlStates)[number];
export type FrontOverlayState = (typeof frontOverlayStates)[number];
export type FrontSelectionState = (typeof frontSelectionStates)[number];
export type FrontValueState = (typeof frontValueStates)[number];
