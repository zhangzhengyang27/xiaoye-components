import { h } from "vue";
import { XyEmpty, type EmptyProps } from "xiaoye-components";

const emptyProps: EmptyProps = {
  title: "暂无项目",
  description: "",
  image: "https://example.com/empty.png",
  imageAlt: "空状态插画",
  imageSize: 160
};

void emptyProps;

const stringSizeProps: EmptyProps = {
  imageSize: "12rem"
};

void stringSizeProps;

const vnode = h(
  XyEmpty,
  {
    title: "暂无成员",
    imageAlt: "成员空状态"
  },
  {
    image: () => "image",
    title: () => "title",
    description: () => "description",
    default: () => "action"
  }
);

void vnode;

const invalidImageAlt: EmptyProps = {
  // @ts-expect-error imageAlt should be a string
  imageAlt: 1
};

void invalidImageAlt;

const invalidImageSize: EmptyProps = {
  // @ts-expect-error imageSize should be a string or number
  imageSize: true
};

void invalidImageSize;
