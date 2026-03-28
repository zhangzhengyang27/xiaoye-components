import type { ConfigProviderContext, ConfigProviderProps } from "xiaoye-components";
import {
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX,
  createConfigProviderContext
} from "xiaoye-components";

const props: ConfigProviderProps = {
  namespace: "admin",
  locale: {
    submit: "提交"
  },
  zIndex: 3100,
  size: "lg",
  dialog: {
    draggable: true
  },
  loading: {
    text: "加载中",
    fullscreen: true
  },
  message: {
    duration: 2500,
    placement: "top-right"
  },
  notification: {
    duration: 3200,
    position: "bottom-left"
  }
};

void props;

const context: ConfigProviderContext = createConfigProviderContext(props);

void context;
void DEFAULT_NAMESPACE;
void DEFAULT_SIZE;
void DEFAULT_Z_INDEX;

const invalidConfigProviderProps: ConfigProviderProps = {
  // @ts-expect-error unsupported size should be rejected
  size: "xl"
};

void invalidConfigProviderProps;
