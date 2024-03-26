<template>
  <div class="media-field input-field">
    <DropDown v-model="model" :options="options" :show-cancel="showCancel" :cancel="cancel" />
    <Button text="Browse" :on-click="func" :width="125"></Button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import Button from "../Generic/Button.vue";
import DropDown from "../Generic/DropDown.vue";
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
.media-field {
  display: grid;
  grid-template-columns: 1fr 90px;
}
</style>
