import { computed, inject, ref } from "vue";
import { useConfig } from "@xiaoye/composables";
import { formKey } from "../../form/src/context";
import type { ButtonProps, ButtonType } from "./button";
import { buttonGroupContextKey } from "./constants";

export function useButton(
  props: ButtonProps,
  attrs: Record<string, unknown>,
  emit: (event: "click", payload: MouseEvent) => void
) {
  const { size: globalSize } = useConfig();
  const form = inject(formKey, null);
  const buttonGroup = inject(buttonGroupContextKey, null);
  const buttonRef = ref<HTMLElement | null>(null);

  const resolvedSize = computed(
    () => props.size ?? buttonGroup?.size.value ?? globalSize.value
  );
  const resolvedType = computed<ButtonType>(
    () => props.type ?? buttonGroup?.type.value ?? "default"
  );
  const isButtonTag = computed(() => props.tag === "button");
  const isLinkTag = computed(
    () => props.tag === "a" && typeof attrs.href === "string" && attrs.href.length > 0
  );
  const isLink = computed(() => props.link);
  const isText = computed(() => !isLink.value && props.text);
  const isPlain = computed(() => !isLink.value && !isText.value && props.plain);
  const isDisabled = computed(() => props.disabled || props.loading);
  const hasBg = computed(() => isText.value && props.bg);
  const needsButtonRole = computed(() => !isButtonTag.value && !isLinkTag.value);

  const buttonAttrs = computed(() => {
    if (isButtonTag.value) {
      return {
        type: props.nativeType,
        disabled: isDisabled.value,
        autofocus: props.autofocus,
        "aria-busy": props.loading ? "true" : undefined
      };
    }

    return {
      role: needsButtonRole.value ? "button" : undefined,
      "aria-disabled": isDisabled.value ? "true" : undefined,
      "aria-busy": props.loading ? "true" : undefined,
      tabindex: isDisabled.value ? -1 : (needsButtonRole.value ? 0 : attrs.tabindex)
    };
  });

  function handleClick(event: MouseEvent) {
    if (isDisabled.value) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (isButtonTag.value && props.nativeType === "reset" && form) {
      event.preventDefault();
      form.resetFields();
    }

    emit("click", event);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!needsButtonRole.value) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    if (isDisabled.value) {
      event.stopPropagation();
      return;
    }

    buttonRef.value?.click();
  }

  return {
    buttonRef,
    buttonAttrs,
    handleClick,
    handleKeydown,
    hasBg,
    isLink,
    isPlain,
    isText,
    isButtonTag,
    isDisabled,
    needsButtonRole,
    resolvedSize,
    resolvedType
  };
}
