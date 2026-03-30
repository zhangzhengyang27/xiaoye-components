import type { FormProp, FormRules } from "xiaoye-components";

const rules: FormRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  role: [{ required: true, trigger: ["change"] }]
};

void rules;

const invalidRules: FormRules = {
  name: [
    {
      // @ts-expect-error unsupported trigger should fail
      trigger: "submit"
    }
  ]
};

void invalidRules;

const nestedProp: FormProp = ["profile", "name"];

void nestedProp;
