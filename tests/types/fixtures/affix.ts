import type { AffixInstance, AffixProps, AffixScrollPayload } from "xiaoye-components";

const affixProps: AffixProps = {
  offset: 24,
  position: "top",
  target: ".toolbar-shell",
  zIndex: 1200,
  teleported: true,
  appendTo: "body"
};

void affixProps;

const payload: AffixScrollPayload = {
  scrollTop: 240,
  fixed: true
};

void payload;

const affixRef = null as AffixInstance | null;

void affixRef;

const invalidPosition: AffixProps = {
  // @ts-expect-error position should be top or bottom
  position: "left"
};

void invalidPosition;

const invalidOffset: AffixProps = {
  // @ts-expect-error offset should be a number
  offset: "24px"
};

void invalidOffset;

const invalidAppendTo: AffixProps = {
  // @ts-expect-error appendTo should be string or HTMLElement
  appendTo: 200
};

void invalidAppendTo;
