<template>
  <div class="text-input" :class="{ cancelable: showCancel, locked }">
    <span @click="onClick">
      <input type="text" v-model="model" style="display: inline-block" />
    </span>
    <CancelButton v-if="showCancel" @click="cancel" />
  </div>
</template>

<script setup lang="ts">
import CancelButton from './CancelButton.vue';

withDefaults(
  defineProps<{
    showCancel?: boolean;
    cancel?: () => void;
    locked?: boolean;
    onClick?: () => void;
  }>(),
  {
    showCancel: false,
    locked: false,
    cancel: () => {},
  }
);

const model = defineModel();
</script>

<style lang="scss" scoped>
.text-input {
  display: inline-block;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  input[type="text"] {
    /* width: calc(100% - 100px - 16px); */
    padding: calc(0.7em - 2px) 1em;
    border: 1px solid var(--tertiary-color);
    background-color: var(--tertiary-color);
    color: var(--secondary-color);
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border: 1px solid var(--highlight-color);
    }
  }

  // button {
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   width: calc(2em + 2px);
  //   height: calc(2em + 2px);
  //   background-color: var(--tertiary-color);
  //   color: var(--secondary-color);
  //   border: none;
  //   cursor: pointer;

  //   &:hover {
  //     background-color: var(--highlight-color);
  //     color: var(--tertiary-color);
  //   }
  // }

  &.cancelable {
    input[type="text"] {
      width: calc(100% - 32px);
    }
  }

  &.locked {
    input[type="text"] {
      // background-color: var(--secondary-color);
      // color: var(--tertiary-color);
      // border: 1px solid var(--secondary-color);
      pointer-events: none;
    }
  }
}
</style>
