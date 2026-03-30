<script setup lang="ts">
import { computed, ref, toRaw } from "vue";
import {
  XyButton,
  XyCheckbox,
  XyForm,
  XyFormItem,
  XyIcon,
  XyInput,
  type FormRules
} from "@xiaoye/components";
import { useNamespace } from "@xiaoye/composables";
import type {
  LoginFormInstance,
  LoginFormModel,
  LoginFormProps,
  LoginFormThirdPartyItem
} from "./login-form";

defineOptions({
  name: "XyLoginForm"
});

type FormExpose = {
  validate: () => Promise<boolean>;
};

type InputExpose = {
  focus: () => void;
};

const props = withDefaults(defineProps<LoginFormProps>(), {
  title: "欢迎登录",
  description: "请输入账号信息后继续访问控制台。",
  loading: false,
  disabled: false,
  submitText: "登录",
  showRemember: true,
  rememberLabel: "记住我",
  usernamePlaceholder: "请输入用户名",
  passwordPlaceholder: "请输入密码",
  rules: () => ({}),
  thirdPartyItems: () => []
});

const emit = defineEmits<{
  submit: [payload: LoginFormModel];
  "third-party-click": [item: LoginFormThirdPartyItem];
}>();

const ns = useNamespace("login-form");
const formRef = ref<FormExpose | null>(null);
const usernameRef = ref<InputExpose | null>(null);
const passwordRef = ref<InputExpose | null>(null);
const model = props.model as LoginFormModel;
const formModel = model as unknown as Record<string, unknown>;

const inputDisabled = computed(() => props.disabled || props.loading);
const resolvedRules = computed<FormRules>(() => ({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["blur", "change"]
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur", "change"]
    }
  ],
  ...props.rules
}));

function cloneModel() {
  const rawModel = toRaw(model);
  return {
    username: rawModel.username,
    password: rawModel.password,
    remember: rawModel.remember
  };
}

function focus(field: "username" | "password" = "username") {
  if (field === "password") {
    passwordRef.value?.focus();
    return;
  }

  usernameRef.value?.focus();
}

async function validate() {
  return (await formRef.value?.validate()) ?? false;
}

async function submit() {
  if (inputDisabled.value) {
    return false;
  }

  const valid = await validate();

  if (!valid) {
    if (!model.username) {
      focus("username");
    } else if (!model.password) {
      focus("password");
    }

    return false;
  }

  emit("submit", cloneModel());
  return true;
}

defineExpose<LoginFormInstance>({
  validate,
  submit,
  focus
});
</script>

<template>
  <section
    :class="[
      ns.base.value,
      inputDisabled ? 'is-disabled' : '',
      props.loading ? 'is-loading' : ''
    ]"
  >
    <header v-if="props.title || props.description" class="xy-login-form__header">
      <h2 v-if="props.title" class="xy-login-form__title">{{ props.title }}</h2>
      <p v-if="props.description" class="xy-login-form__description">{{ props.description }}</p>
    </header>

    <xy-form
      ref="formRef"
      :model="formModel"
      :rules="resolvedRules"
      label-position="top"
      :disabled="inputDisabled"
      class="xy-login-form__form"
    >
      <xy-form-item prop="username">
        <xy-input
          ref="usernameRef"
          v-model="model.username"
          :placeholder="props.usernamePlaceholder"
          prefix-icon="mdi:account-outline"
          :disabled="inputDisabled"
          @keyup.enter="submit"
        />
      </xy-form-item>

      <xy-form-item prop="password">
        <xy-input
          ref="passwordRef"
          v-model="model.password"
          type="password"
          show-password
          :placeholder="props.passwordPlaceholder"
          prefix-icon="mdi:lock-outline"
          :disabled="inputDisabled"
          @keyup.enter="submit"
        />
      </xy-form-item>

      <div v-if="props.showRemember" class="xy-login-form__remember">
        <xy-checkbox v-model="model.remember" :disabled="inputDisabled">
          {{ props.rememberLabel }}
        </xy-checkbox>
      </div>

      <xy-button
        type="primary"
        block
        :loading="props.loading"
        :disabled="inputDisabled"
        @click="submit"
      >
        {{ props.submitText }}
      </xy-button>
    </xy-form>

    <div v-if="props.thirdPartyItems.length > 0" class="xy-login-form__third-party">
      <div class="xy-login-form__divider">
        <span>其他登录方式</span>
      </div>

      <div class="xy-login-form__third-party-actions">
        <xy-button
          v-for="item in props.thirdPartyItems"
          :key="item.key"
          plain
          :disabled="inputDisabled"
          @click="emit('third-party-click', item)"
        >
          <xy-icon v-if="item.icon" :icon="item.icon" :size="16" />
          {{ item.label }}
        </xy-button>
      </div>
    </div>
  </section>
</template>
