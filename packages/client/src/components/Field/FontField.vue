<template>
  <div class="font-field input-field" :class="{ slim, full: !slim }">
    <DropDown v-model="model" :options="sorcerer.fontNames" :show-cancel="showCancel" :cancel="cancel" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import DropDown from "../Generic/DropDown.vue";
import { sorcererStore } from "../../stores/sorcerer";
defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
  slim?: boolean;
}>();

const model = defineModel();
const sorcerer = sorcererStore();
</script>

<style lang="scss" scoped></style>
