<script setup lang="ts">
import { computed, ref } from "vue";
import type { CSSProperties, PropType } from "vue";
import { useNamespace } from "xiaoye-primitives";
import XyBadge from "@xiaoye/components/badge";
import XyIcon from "@xiaoye/components/icon";
import XyImage from "@xiaoye/components/image";

export interface ProductCardTag {
  text: string;
  type?: "primary" | "success" | "warning" | "danger";
}

export interface ProductCardProps {
  image?: string | string[];
  title?: string;
  description?: string;
  price?: number | string;
  originalPrice?: number | string;
  tags?: ProductCardTag[];
  stock?: number;
  status?: "online" | "offline" | "soldout";
  size?: "sm" | "md" | "lg";
  horizontal?: boolean;
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  image: "",
  title: "",
  description: "",
  price: "",
  originalPrice: "",
  tags: () => [],
  stock: undefined,
  status: "online",
  size: "md",
  horizontal: false
});

const slots = defineSlots<{
  image?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
  actions?: () => unknown;
}>();

const ns = useNamespace("product-card");

const imageList = computed<string[]>(() => {
  if (Array.isArray(props.image)) {
    return props.image;
  }
  return props.image ? [props.image] : [];
});

const currentIndex = ref(0);

const currentImage = computed(() => imageList.value[currentIndex.value.valueOf()] || "");

const hasMultipleImages = computed(() => imageList.value.length > 1);

const isSoldOut = computed(() => props.status === "soldout" || (props.stock !== undefined && props.stock <= 0));
const isOffline = computed(() => props.status === "offline");

const formattedPrice = computed(() => {
  if (!props.price) return "";
  const num = typeof props.price === "number" ? props.price : parseFloat(props.price);
  return isNaN(num) ? String(props.price) : `¥${num.toFixed(2)}`;
});

const formattedOriginalPrice = computed(() => {
  if (!props.originalPrice) return "";
  const num = typeof props.originalPrice === "number" ? props.originalPrice : parseFloat(props.originalPrice);
  return isNaN(num) ? String(props.originalPrice) : `¥${num.toFixed(2)}`;
});

const cardClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.size}`,
  ns.is("horizontal", props.horizontal),
  ns.is("soldout", isSoldOut.value),
  ns.is("offline", isOffline.value)
]);

const priceStyle = computed<CSSProperties>(() => ({}));

function selectImage(index: number) {
  currentIndex.value = index;
}

function handleImageClick() {
  if (isSoldOut.value || isOffline.value) return;
}

function handlePrev(e: Event) {
  e.stopPropagation();
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function handleNext(e: Event) {
  e.stopPropagation();
  if (currentIndex.value < imageList.value.length - 1) {
    currentIndex.value++;
  }
}
</script>

<template>
  <div :class="cardClasses" role="article">
    <div v-if="slots.image || imageList.length > 0" :class="[`${ns.base.value}__image-wrap`]">
      <slot name="image">
        <div
          :class="[`${ns.base.value}__image-container`]"
          @click="handleImageClick"
        >
          <XyImage
            v-if="currentImage"
            :src="currentImage"
            :class="`${ns.base.value}__image`"
            fit="cover"
            :preview-src-list="imageList"
            :preview-teleported="true"
          />
          <div v-else :class="`${ns.base.value}__image-placeholder`">
            <XyIcon icon="mdi:image-off-outline" :size="32" />
          </div>

          <div
            v-if="hasMultipleImages"
            :class="`${ns.base.value}__image-nav`"
          >
            <button
              :class="[`${ns.base.value}__nav-btn`, `${ns.base.value}__nav-prev`]"
              :disabled="currentIndex === 0"
              @click="handlePrev"
              aria-label="上一张"
            >
              <XyIcon icon="mdi:chevron-left" :size="16" />
            </button>
            <button
              :class="[`${ns.base.value}__nav-btn`, `${ns.base.value}__nav-next`]"
              :disabled="currentIndex === imageList.length - 1"
              @click="handleNext"
              aria-label="下一张"
            >
              <XyIcon icon="mdi:chevron-right" :size="16" />
            </button>
          </div>

          <div
            v-if="hasMultipleImages"
            :class="`${ns.base.value}__thumbnails`"
          >
            <button
              v-for="(img, idx) in imageList"
              :key="idx"
              :class="[`${ns.base.value}__thumb`, { 'is-active': idx === currentIndex }]"
              @click.stop="selectImage(idx)"
              :aria-label="`第${idx + 1}张图片`"
            >
              <img :src="img" :alt="`缩略图${idx + 1}`" />
            </button>
          </div>

          <div
            v-if="isSoldOut"
            :class="`${ns.base.value}__status-overlay`"
          >
            <span>已售罄</span>
          </div>
          <div
            v-else-if="isOffline"
            :class="`${ns.base.value}__status-overlay`"
          >
            <span>已下架</span>
          </div>
        </div>
      </slot>

      <slot name="header" />
    </div>

    <div :class="`${ns.base.value}__content`">
      <div :class="`${ns.base.value}__info`">
        <h3
          v-if="slots.default || props.title"
          :class="`${ns.base.value}__title`"
        >
          <slot>{{ props.title }}</slot>
        </h3>
        <p
          v-if="props.description"
          :class="`${ns.base.value}__description`"
        >
          {{ props.description }}
        </p>
      </div>

      <div v-if="props.tags.length > 0" :class="`${ns.base.value}__tags`">
        <XyBadge
          v-for="(tag, idx) in props.tags"
          :key="idx"
          :type="tag.type || 'primary'"
          size="small"
        >
          {{ tag.text }}
        </XyBadge>
      </div>

      <div :class="`${ns.base.value}__price-row`">
        <div :class="`${ns.base.value}__price`">
          <span :class="`${ns.base.value}__price-current`">{{ formattedPrice }}</span>
          <span
            v-if="formattedOriginalPrice"
            :class="`${ns.base.value}__price-original`"
          >
            {{ formattedOriginalPrice }}
          </span>
        </div>
        <slot name="actions" />
      </div>

      <div v-if="props.stock !== undefined" :class="`${ns.base.value}__stock`">
        <span v-if="isSoldOut" :class="`${ns.base.value}__stock-soldout`">库存不足</span>
        <span v-else :class="`${ns.base.value}__stock-count`">库存: {{ props.stock }}</span>
      </div>
    </div>
  </div>
</template>
