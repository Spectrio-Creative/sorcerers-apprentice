<template>
  <div class="text-field input-field" :class="{ slim, full: !slim }">
    <TextInput v-model="model" :show-cancel="showCancel" :cancel="cancel" :locked="locked" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import TextInput from "../Generic/TextInput.vue";
defineProps<{
  title: string;
  showCancel?: boolean;
  locked?: boolean;
  cancel?: () => void;
  slim?: boolean;
}>();

const model = defineModel();
</script>

<style lang="scss" scoped></style>
