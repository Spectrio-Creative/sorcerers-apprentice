<template>
    <Button text="Browse" :on-click="func" :width="125"></Button>
  <div class="media-field input-field" :class="{ slim, full: !slim }">
    <DropDown ref="selector" v-model="model" :options="options" :show-cancel="showCancel" :cancel="cancel" />
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
  fileType: ImportFile | ExportFile;
  options: string[];
  slim?: boolean;
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

  &.slim {
    grid-template-columns: 1fr calc(70px - 3em);
    gap: 5px;
  }
}
</style>
