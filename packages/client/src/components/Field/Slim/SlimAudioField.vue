<template>
  <div class="media-field slim-input-field">
    <DropDown v-model="model" :options="options" :show-cancel="showCancel" :cancel="cancel" slim />
    <Button :on-click="func" :width="70" :styles="['icon']"><IconFolder /></Button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import Button from "../../Generic/Button.vue";
import DropDown from "../../Generic/DropDown.vue";
import IconFolder from "../../Icons/IconFolder.vue";
defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
  options: string[];
}>();

const func = () => {
  console.log("clicked");
};

const model = defineModel();
</script>

<style lang="scss" scoped>
.media-field.slim-input-field {
  display: grid;
  grid-template-columns: 1fr calc(70px - 3em);
  gap: 5px;
}
</style>
