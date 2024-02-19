<template>
  <div class="font-field input-field">
    <div class="input-label" style="display: inline-block">{{ title }}</div>
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
}>();

const model = defineModel();
const sorcerer = sorcererStore();
</script>

<style lang="scss" scoped></style>
