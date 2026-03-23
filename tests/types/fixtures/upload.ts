import type { UploadFileItem, UploadProps } from "xiaoye-components";

const files: UploadFileItem[] = [
  {
    uid: "1",
    name: "avatar.png",
    size: 1024
  }
];

const props: UploadProps = {
  modelValue: files,
  multiple: true
};

void props;

const invalidProps: UploadProps = {
  // @ts-expect-error invalid maxCount type
  maxCount: "2"
};

void invalidProps;
