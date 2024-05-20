<template>
  <button :class="{checked: model}" @click="click">
    <!-- <span v-if="model">✔</span> -->
    <span v-if="model">x</span>
    <span v-else></span>
  </button>
</template>

<script setup lang="ts">
const model = defineModel({ default: false });

const click = () => {
  model.value = !model.value;
};
</script>

<style scoped>
button {
  /* position: absolute; */
  font-family: monospace;
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
    background-color: var(--hover-color);
    color: var(--tertiary-color);
  }

  &.checked {
    background-color: var(--highlight-color);
    color: var(--tertiary-color);

    &:hover {
      background-color: var(--highlight-color-dark);
    }
  }
}
</style>
