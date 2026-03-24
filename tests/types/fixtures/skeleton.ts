import { h } from "vue";
import type {
  SkeletonItemProps,
  SkeletonProps,
  SkeletonThrottle,
  SkeletonThrottleOptions
} from "xiaoye-components";
import { XySkeleton, XySkeletonItem } from "xiaoye-components";

const throttleValue: SkeletonThrottle = 300;
const throttleOptions: SkeletonThrottleOptions = {
  leading: 200,
  trailing: 500,
  initVal: true
};

const skeletonProps: SkeletonProps = {
  animated: true,
  count: 2,
  rows: 4,
  loading: true,
  throttle: throttleOptions
};

void throttleValue;
void skeletonProps;

const itemProps: SkeletonItemProps = {
  variant: "circle"
};

void itemProps;

const vnode = h(
  XySkeleton,
  {
    loading: false
  },
  {
    template: () => h(XySkeletonItem, { variant: "rect" }),
    default: () => h(XySkeleton.Item, { variant: "button" })
  }
);

void vnode;

const invalidVariant: SkeletonItemProps = {
  // @ts-expect-error invalid variant should be rejected
  variant: "badge"
};

void invalidVariant;

const invalidThrottle: SkeletonProps = {
  throttle: {
    // @ts-expect-error invalid throttle option should be rejected
    after: 500
  }
};

void invalidThrottle;
