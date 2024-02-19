<template>
  <div class="media-field input-field">
    <div class="input-label" style="display: inline-block">{{ title }}</div>
    <DropDown v-model="model" :options="sorcerer.libraryAssetNames" :show-cancel="showCancel" :cancel="cancel" />
    <Button text="Browse" :on-click="func" :width="125"></Button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import Button from "../Generic/Button.vue";
import DropDown from '../Generic/DropDown.vue';
import { sorcererStore } from '../../stores/sorcerer';
defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
}>();

const func = () => {
  console.log("clicked");
};

const model = defineModel();
const sorcerer = sorcererStore();
</script>

<style scoped></style>
