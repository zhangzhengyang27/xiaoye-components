import { h } from "vue";
import {
  XyAnchor,
  XyAnchorLink,
  type AnchorContainer,
  type AnchorDirection,
  type AnchorLinkProps,
  type AnchorProps
} from "xiaoye-components";

const elementContainer = document.createElement("div");
const direction: AnchorDirection = "horizontal";
const container: AnchorContainer = window;

const anchorProps: AnchorProps = {
  container,
  offset: 24,
  bound: 12,
  duration: 320,
  marker: true,
  direction,
  syncHash: false
};

const anchorLinkProps: AnchorLinkProps = {
  title: "介绍",
  href: "#anchor-intro"
};

void anchorProps;
void anchorLinkProps;
void elementContainer;

const anchorVNode = h(
  XyAnchor,
  {
    container: elementContainer,
    direction: "vertical",
    syncHash: true
  },
  {
    default: () => [
      h(XyAnchorLink as never, { title: "概览", href: "#overview" } as never),
      h(
        XyAnchor.Link as never,
        {
          title: "API",
          href: "#api"
        } as never,
        {
          default: () => [h(XyAnchorLink as never, { title: "事件", href: "#events" } as never)]
        }
      )
    ]
  }
);

void anchorVNode;

const invalidDirection: AnchorProps = {
  // @ts-expect-error invalid direction
  direction: "diagonal"
};

void invalidDirection;

const invalidContainer: AnchorProps = {
  // @ts-expect-error invalid container
  container: 200
};

void invalidContainer;

const invalidSyncHash: AnchorProps = {
  // @ts-expect-error invalid syncHash
  syncHash: "yes"
};

void invalidSyncHash;
