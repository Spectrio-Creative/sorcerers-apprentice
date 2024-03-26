<template>
  <div class="color-field input-field">
    <PickColors
      class="pointer"
      v-model:value="model"
      v-model:show-picker="showPicker"
      :width="25"
      :height="25"
      show-alpha
    />
    <div class="pick-it">
      <TextInput v-model="model" :show-cancel="showCancel" :cancel="cancelIt" :locked="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelRef, defineProps, ref } from "vue";
import TextInput from "../Generic/TextInput.vue";
import PickColors from "vue-pick-colors";

const props = defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
}>();

const model: ModelRef<string> = defineModel({ default: "#000000" });
const showPicker = ref(false);

const cancelIt = () => {
  showPicker.value = false;
  if (props.cancel) props.cancel();
};
</script>

<style lang="scss" scoped>
.input-field.color-field {
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
</style>
