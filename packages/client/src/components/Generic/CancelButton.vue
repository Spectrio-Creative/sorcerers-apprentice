<template>
  <button @click="click">x</button>
</template>

<script setup lang="ts">
defineProps<{
  click?: () => void;
}>();
</script>

<style scoped>
button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: calc(2em + 2px);
  height: calc(2em + 2px);
  background-color: var(--tertiary-color);
  color: var(--secondary-color);
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--highlight-color);
    color: var(--tertiary-color);
  }
}
</style>
