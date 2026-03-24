import type { UploadFileItem, UploadProps } from "xiaoye-components";

const files: UploadFileItem[] = [
  {
    uid: "1",
    name: "avatar.png",
    size: 1024
  }
];

const props: UploadProps = {
  fileList: files,
  multiple: true,
  autoUpload: false,
  limit: 2,
  beforeUpload: (file) => file.size < 2_000_000,
  beforeRemove: () => true,
  onPreview: (file) => file.name,
  onChange: (_file, nextFiles) => nextFiles.length,
  httpRequest: () => Promise.resolve({ ok: true }),
  listType: "picture"
};

void props;

const invalidProps: UploadProps = {
  // @ts-expect-error invalid list type
  listType: "gallery"
};

void invalidProps;
