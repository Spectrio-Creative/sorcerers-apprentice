<template>
  <div ref="textInput" class="text-input" :class="{ cancelable: showCancel, locked }">
    <Tooltip :text="tooltipText" :max-width="500">
      <span @click="onClick">
        <input type="text" v-model="model" style="display: inline-block" />
      </span>
    </Tooltip>
    <CancelButton v-if="showCancel" @click="cancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import CancelButton from "./CancelButton.vue";
import Tooltip from "./Tooltip.vue";

withDefaults(
  defineProps<{
    showCancel?: boolean;
    cancel?: () => void;
    locked?: boolean;
    onClick?: () => void;
  }>(),
  {
    showCancel: false,
    locked: false,
    cancel: () => {},
  }
);

const model = defineModel();

const overflow = ref(false);
const textInput = ref<HTMLInputElement | null>(null);
const tooltipText = computed(() => overflow.value ? (model.value as string) || "" : "");

const updateOverflow = () => {
  if (model.value === "") return false;
  if (!textInput.value) return false;
  const $textInput = $(textInput.value as HTMLElement);
  const input = $textInput.find("input")[0];
  const scrollWidth = input?.scrollWidth || 0;
  const clientWidth = input?.clientWidth || 0;
  // console.log(textInput.value, scrollWidth, clientWidth, model.value);
  return scrollWidth > clientWidth;
};

watch(model, () => {
  overflow.value = updateOverflow();
});

onMounted(() => {
  overflow.value = updateOverflow();

  setTimeout(() => {
    // The timeout is needed to make sure that the initial overflow is calculated correctly
    overflow.value = updateOverflow();
  }, 200);
});
</script>

<style lang="scss" scoped>
.text-input {
  display: inline-block;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  input[type="text"] {
    /* width: calc(100% - 100px - 16px); */
    padding: calc(0.7em - 2px) 1em;
    border: 1px solid var(--tertiary-color);
    background-color: var(--tertiary-color);
    color: var(--secondary-color);
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border: 1px solid var(--highlight-color);
    }
  }

  // button {
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   width: calc(2em + 2px);
  //   height: calc(2em + 2px);
  //   background-color: var(--tertiary-color);
  //   color: var(--secondary-color);
  //   border: none;
  //   cursor: pointer;

  //   &:hover {
  //     background-color: var(--highlight-color);
  //     color: var(--tertiary-color);
  //   }
  // }

  &.cancelable {
    input[type="text"] {
      width: calc(100% - 32px);
    }
  }

  &.locked {
    input[type="text"] {
      // background-color: var(--secondary-color);
      // color: var(--tertiary-color);
      // border: 1px solid var(--secondary-color);
      pointer-events: none;
    }
  }
}
</style>
