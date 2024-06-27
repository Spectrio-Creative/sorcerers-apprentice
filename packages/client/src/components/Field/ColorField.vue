<template>
  <div class="color-field input-field" :class="{slim, full: !slim, cancelable: showCancel}">
    <PickColors
      class="pointer"
      v-model:value="model"
      v-model:show-picker="showPicker"
      :width="25"
      :height="height"
      show-alpha
    />
    <template v-if="slim">
      <div class="overlay">{{ model }}</div>
      <CancelButton v-if="showCancel" :click="cancel" />
    </template>
    <div v-else class="pick-it">
      <TextInput v-model="model" :show-cancel="showCancel" :cancel="cancelIt" :locked="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelRef, computed, defineProps, ref } from "vue";
import TextInput from "../Generic/TextInput.vue";
import CancelButton from "../Generic/CancelButton.vue";
import PickColors from "vue-pick-colors";
// @ts-ignore
import tinycolor from 'tinycolor2';

const props = defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
  slim?: boolean;
}>();

const model: ModelRef<string> = defineModel({ default: "#000000" });
const showPicker = ref(false);
const height = computed(() => props.slim ? 27 : 25);

const cancelIt = () => {
  showPicker.value = false;
  if (props.cancel) props.cancel();
};

const overlayColor = computed(() => {
  return tinycolor(model.value).isDark() ? "white" : "black";
});
</script>

<style lang="scss" scoped>
.full.input-field.color-field {
  display: grid;
  grid-template-columns: 25px 1fr;
  position: relative;

  .pointer {
    cursor: pointer;
  }
  .pick-it {
    position: relative;
    display: block;
    // cursor: pointer;
  }
}

.slim.input-field.color-field {
  position: relative;

  .pointer {
    cursor: pointer;
    width: 100%;
    & > :deep(.color-item) {
      margin: 0;
      width: 100% !important;
      border-radius: 0 !important;
    }
  }


  .overlay {
    color: v-bind(overlayColor);
    position: absolute;
    top: calc(50% - 0.6em);
    left: 1em;
    pointer-events: none;
  }

  &.cancelable {
    .pointer {
    width: calc(100% - 2.8em);
  }
    // .overlay {
    //   left: 2.5em;
    // }
  }
}
</style>
