<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import { useNamespace } from "xiaoye-primitives";
import XyIcon from "@xiaoye/components/icon";
import XyInput from "@xiaoye/components/input";

export interface AddressValue {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
}

export interface RecentAddress {
  label: string;
  value: AddressValue;
}

export type DisplayFormat = "text" | "full";

const props = withDefaults(
  defineProps<{
    modelValue?: AddressValue;
    placeholder?: string;
    displayFormat?: DisplayFormat;
    showStreet?: boolean;
    recentAddresses?: RecentAddress[];
    disabled?: boolean;
    clearable?: boolean;
    size?: "small" | "medium" | "large";
  }>(),
  {
    modelValue: () => ({}),
    placeholder: "请选择省/市/区",
    displayFormat: "text",
    showStreet: true,
    recentAddresses: () => [],
    disabled: false,
    clearable: true,
    size: "medium"
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: AddressValue];
  change: [value: AddressValue];
}>();

const slots = defineSlots<{
  "recent-item"?: (props: { address: RecentAddress; select: () => void }) => unknown;
}>();

const ns = useNamespace("address-picker");

const selectedAddress = ref<AddressValue>({ ...props.modelValue });
const isDropdownOpen = ref(false);
const searchQuery = ref("");
const activeLevel = ref<"province" | "city" | "district">("province");

const provinceList = ref<Array<{ code: string; name: string }>>([]);
const cityList = ref<Array<{ code: string; name: string }>>([]);
const districtList = ref<Array<{ code: string; name: string }>>([]);

const hasProvinces = computed(() => provinceList.value.length > 0);
const hasCities = computed(() => cityList.value.length > 0);
const hasDistricts = computed(() => districtList.value.length > 0);

const filteredProvinces = computed(() => {
  if (!searchQuery.value) return provinceList.value;
  return provinceList.value.filter((p) => p.name.includes(searchQuery.value));
});

const filteredCities = computed(() => {
  if (!searchQuery.value) return cityList.value;
  return cityList.value.filter((c) => c.name.includes(searchQuery.value));
});

const filteredDistricts = computed(() => {
  if (!searchQuery.value) return districtList.value;
  return districtList.value.filter((d) => d.name.includes(searchQuery.value));
});

const currentList = computed(() => {
  switch (activeLevel.value) {
    case "province":
      return filteredProvinces.value;
    case "city":
      return filteredCities.value;
    case "district":
      return filteredDistricts.value;
    default:
      return [];
  }
});

const displayText = computed(() => {
  const { province, city, district } = selectedAddress.value;
  if (!province && !city && !district) {
    return props.placeholder;
  }
  return [province, city, district].filter(Boolean).join(" ");
});

const selectedProvince = computed(() =>
  provinceList.value.find((p) => p.name === selectedAddress.value.province)
);
const selectedCity = computed(() =>
  cityList.value.find((c) => c.name === selectedAddress.value.city)
);

function generateMockData() {
  const provinces = [
    { code: "110000", name: "北京市" },
    { code: "310000", name: "上海市" },
    { code: "440000", name: "广东省" },
    { code: "330000", name: "浙江省" },
    { code: "320000", name: "江苏省" },
    { code: "510000", name: "四川省" }
  ];

  const citiesByProvince: Record<string, Array<{ code: string; name: string }>> = {
    "110000": [
      { code: "110100", name: "市辖区" }
    ],
    "310000": [
      { code: "310100", name: "市辖区" }
    ],
    "440000": [
      { code: "440100", name: "广州市" },
      { code: "440300", name: "深圳市" },
      { code: "440500", name: "汕头市" }
    ],
    "330000": [
      { code: "330100", name: "杭州市" },
      { code: "330200", name: "宁波市" },
      { code: "330300", name: "温州市" }
    ],
    "320000": [
      { code: "320100", name: "南京市" },
      { code: "320500", name: "苏州市" },
      { code: "320200", name: "无锡市" }
    ],
    "510000": [
      { code: "510100", name: "成都市" },
      { code: "510300", name: "自贡市" },
      { code: "510500", name: "攀枝花市" }
    ]
  };

  const districtsByCity: Record<string, Array<{ code: string; name: string }>> = {
    "440100": [
      { code: "440103", name: "荔湾区" },
      { code: "440104", name: "越秀区" },
      { code: "440105", name: "海珠区" },
      { code: "440106", name: "天河区" },
      { code: "440111", name: "白云区" }
    ],
    "440300": [
      { code: "440303", name: "罗湖区" },
      { code: "440304", name: "福田区" },
      { code: "440305", name: "南山区" }
    ],
    "330100": [
      { code: "330102", name: "上城区" },
      { code: "330105", name: "拱墅区" },
      { code: "330106", name: "西湖区" },
      { code: "330108", name: "滨江区" }
    ],
    "320100": [
      { code: "320102", name: "玄武区" },
      { code: "320104", name: "秦淮区" },
      { code: "320105", name: "建邺区" }
    ],
    "510100": [
      { code: "510104", name: "锦江区" },
      { code: "510105", name: "青羊区" },
      { code: "510106", name: "金牛区" }
    ]
  };

  return { provinces, citiesByProvince, districtsByCity };
}

function initializeData() {
  const { provinces } = generateMockData();
  provinceList.value = provinces;
}

function selectProvince(province: { code: string; name: string }) {
  selectedAddress.value.province = province.name;
  selectedAddress.value.city = undefined;
  selectedAddress.value.district = undefined;
  cityList.value = [];
  districtList.value = [];

  const { citiesByProvince } = generateMockData();
  const cities = citiesByProvince[province.code] || [];
  if (cities.length === 1 && cities[0].name === "市辖区") {
    selectedAddress.value.city = cities[0].name;
    selectCity(cities[0]);
  } else {
    cityList.value = cities;
    activeLevel.value = "city";
  }

  emitSelection();
}

function selectCity(city: { code: string; name: string }) {
  selectedAddress.value.city = city.name;
  selectedAddress.value.district = undefined;
  districtList.value = [];

  const { districtsByCity } = generateMockData();
  const districts = districtsByCity[city.code] || [];
  if (districts.length > 0) {
    districtList.value = districts;
    activeLevel.value = "district";
  } else {
    closeDropdown();
  }

  emitSelection();
}

function selectDistrict(district: { code: string; name: string }) {
  selectedAddress.value.district = district.name;
  emitSelection();
  closeDropdown();
}

function selectRecentAddress(address: RecentAddress) {
  selectedAddress.value = { ...address.value };
  emitSelection();
}

function handleItemClick(item: { code: string; name: string }) {
  switch (activeLevel.value) {
    case "province":
      selectProvince(item);
      break;
    case "city":
      selectCity(item);
      break;
    case "district":
      selectDistrict(item);
      break;
  }
}

function emitSelection() {
  emit("update:modelValue", { ...selectedAddress.value });
  emit("change", { ...selectedAddress.value });
}

function toggleDropdown() {
  if (props.disabled) return;
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    searchQuery.value = "";
    if (selectedAddress.value.province) {
      const province = provinceList.value.find((p) => p.name === selectedAddress.value.province);
      if (province) {
        const { citiesByProvince } = generateMockData();
        cityList.value = citiesByProvince[province.code] || [];
      }
      if (selectedAddress.value.city) {
        const city = cityList.value.find((c) => c.name === selectedAddress.value.city);
        if (city) {
          const { districtsByCity } = generateMockData();
          districtList.value = districtsByCity[city.code] || [];
        }
      }
    }
  }
}

function closeDropdown() {
  isDropdownOpen.value = false;
  searchQuery.value = "";
}

function clearValue(e: Event) {
  e.stopPropagation();
  selectedAddress.value = {};
  cityList.value = [];
  districtList.value = [];
  emitSelection();
}

function handleStreetChange(e: Event) {
  const target = e.target as HTMLInputElement;
  selectedAddress.value.street = target.value;
  emitSelection();
}

function goBack() {
  if (activeLevel.value === "district" && hasDistricts.value) {
    activeLevel.value = "city";
  } else if (activeLevel.value === "city" && hasCities.value) {
    activeLevel.value = "province";
  }
}

watch(
  () => props.modelValue,
  (val) => {
    selectedAddress.value = { ...val };
  },
  { deep: true }
);

initializeData();

defineExpose({
  selectedAddress,
  open: toggleDropdown,
  close: closeDropdown
});
</script>

<template>
  <div :class="[ns.base.value, props.disabled ? 'is-disabled' : '']">
    <div
      :class="[`${ns.base.value}__trigger`]"
      tabindex="0"
      role="combobox"
      :aria-expanded="isDropdownOpen"
      :aria-disabled="props.disabled"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.escape="closeDropdown"
    >
      <span
        :class="[
          `${ns.base.value}__value`,
          !selectedAddress.province ? 'is-placeholder' : ''
        ]"
      >
        <XyIcon v-if="!selectedAddress.province" icon="mdi:map-marker-outline" :size="16" />
        {{ displayText }}
      </span>

      <span :class="`${ns.base.value}__actions`">
        <button
          v-if="props.clearable && selectedAddress.province && !props.disabled"
          type="button"
          :class="`${ns.base.value}__clear`"
          aria-label="清除"
          @click="clearValue"
        >
          <XyIcon icon="mdi:close-circle" :size="16" />
        </button>
        <XyIcon
          :icon="isDropdownOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          :size="16"
          :class="`${ns.base.value}__arrow`"
        />
      </span>
    </div>

    <Transition name="xy-slide-down">
      <div
        v-if="isDropdownOpen"
        :class="`${ns.base.value}__dropdown`"
        role="listbox"
      >
        <div :class="`${ns.base.value}__search`">
          <XyInput
            v-model="searchQuery"
            :placeholder="`搜索${activeLevel === 'province' ? '省份' : activeLevel === 'city' ? '城市' : '区县'}`"
            size="small"
            clearable
          >
            <template #prefix>
              <XyIcon icon="mdi:magnify" :size="14" />
            </template>
          </XyInput>
        </div>

        <div
          v-if="recentAddresses && recentAddresses.length > 0 && !searchQuery && activeLevel === 'province'"
          :class="`${ns.base.value}__recent`"
        >
          <div :class="`${ns.base.value}__recent-title`">常用地址</div>
          <div :class="`${ns.base.value}__recent-list`">
            <button
              v-for="(addr, idx) in recentAddresses"
              :key="idx"
              type="button"
              :class="`${ns.base.value}__recent-item`"
              @click="selectRecentAddress(addr)"
            >
              <slot name="recent-item" :address="addr" :select="() => selectRecentAddress(addr)">
                <XyIcon icon="mdi:bookmark-outline" :size="14" />
                <span>{{ addr.label }}</span>
              </slot>
            </button>
          </div>
        </div>

        <div :class="`${ns.base.value}__breadcrumb`">
          <button
            type="button"
            :class="[`${ns.base.value}__breadcrumb-item`, { 'is-active': activeLevel === 'province' }]"
            @click="activeLevel = 'province'"
          >
            {{ selectedAddress.province || "选择省份" }}
          </button>
          <template v-if="selectedAddress.province">
            <XyIcon icon="mdi:chevron-right" :size="14" />
            <button
              type="button"
              :class="[
                `${ns.base.value}__breadcrumb-item`,
                { 'is-active': activeLevel === 'city' }
              ]"
              @click="activeLevel = 'city'"
            >
              {{ selectedAddress.city || "选择城市" }}
            </button>
          </template>
          <template v-if="selectedAddress.city">
            <XyIcon icon="mdi:chevron-right" :size="14" />
            <button
              type="button"
              :class="[
                `${ns.base.value}__breadcrumb-item`,
                { 'is-active': activeLevel === 'district' }
              ]"
              @click="activeLevel = 'district'"
            >
              {{ selectedAddress.district || "选择区县" }}
            </button>
          </template>
        </div>

        <div :class="`${ns.base.value}__list`">
          <div v-if="currentList.length === 0" :class="`${ns.base.value}__empty`">
            <span>暂无数据</span>
          </div>
          <button
            v-for="item in currentList"
            :key="item.code"
            type="button"
            :class="[
              `${ns.base.value}__option`,
              {
                'is-selected':
                  (activeLevel === 'province' && item.name === selectedAddress.province) ||
                  (activeLevel === 'city' && item.name === selectedAddress.city) ||
                  (activeLevel === 'district' && item.name === selectedAddress.district)
              }
            ]"
            @click="handleItemClick(item)"
          >
            <span>{{ item.name }}</span>
            <XyIcon v-if="activeLevel !== 'district' && !(activeLevel === 'city' && !hasDistricts)" icon="mdi:chevron-right" :size="14" />
          </button>
        </div>
      </div>
    </Transition>

    <div
      v-if="props.displayFormat === 'full' && selectedAddress.province"
      :class="`${ns.base.value}__detail`"
    >
      <div :class="`${ns.base.value}__summary`">
        {{ [selectedAddress.province, selectedAddress.city, selectedAddress.district].filter(Boolean).join(" ") }}
      </div>
      <div v-if="props.showStreet" :class="`${ns.base.value}__street`">
        <XyInput
          :model-value="selectedAddress.street"
          placeholder="请输入详细地址"
          :disabled="props.disabled"
          @input="handleStreetChange"
        >
          <template #prefix>
            <XyIcon icon="mdi:home-outline" :size="14" />
          </template>
        </XyInput>
      </div>
    </div>
  </div>
</template>
