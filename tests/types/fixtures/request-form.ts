import type { RequestFormProps, RequestFormSubmitContext } from "@xiaoye/pro-components";

const props: RequestFormProps = {
  title: "请求表单",
  model: {
    name: "小叶"
  },
  immediate: false
};

const submitContext: RequestFormSubmitContext = {
  action: "submit",
  params: {
    name: "小叶"
  },
  page: 1,
  pageSize: 10,
  model: {
    name: "小叶"
  }
};

void props;
void submitContext;
