<template>
  <div>
    <button
      class="btn"
      :class="{ selected, ...styleMap, disabled }"
      @click="onClick"
      :style="width ? `width: calc(${width}px - 3em);` : ''"
      :disabled="disabled"
    >
      {{ text }}
      <slot></slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
type style = "primary" | "secondary" | "tertiary" | "tab" | "refresh" | "round" | "icon" | "dark";
const props = defineProps<{
  text?: string;
  onClick: () => void;
  width?: number;
  selected?: boolean;
  styles?: style[];
  disabled?: boolean;
}>();

const styleMap = props.styles?.map((style) => ({ [style]: true })).reduce((acc, val) => ({ ...acc, ...val }), {}) || {};
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  padding: calc(0.7em - 1px) 1.5em;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  text-decoration: none;
  text-align: center;
  border-radius: 0;
  background-color: var(--primary-color);
  font-size: 1em;
  cursor: pointer;

  &.disabled {
    background-color: var(--tertiary-color);
    border-color: var(--tertiary-color);
    color: var(--hover-color);
    cursor: default;

    &:hover {
      background-color: var(--tertiary-color);
      border-color: var(--tertiary-color);
      color: var(--hover-color);
    }
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: var(--hover-color);
    border-color: var(--hover-color);
    color: var(--primary-color);
  }

  &.selected {
    background-color: var(--hover-color);
    border-color: var(--hover-color);
    color: var(--primary-color);
  }

  &.tab {
    border-color: var(--hover-color);
    position: relative;
    bottom: -1px;
  }

  &.tab.selected {
    background-color: var(--primary-color);
    border-color: var(--hover-color);
    color: var(--secondary-color);
    border-bottom: 1px solid var(--primary-color);
  }

  &.primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--secondary-color);

    &:hover {
      background-color: var(--hover-color);
      border-color: var(--hover-color);
      color: var(--primary-color);
    }
  }

  &.secondary {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    color: var(--primary-color);
  }

  &.tertiary {
    background-color: var(--tertiary-color);
    border-color: var(--tertiary-color);
    color: var(--secondary-color);

    &:hover {
      background-color: var(--tertiary-color-dark);
      border-color: var(--tertiary-color-dark);
    }
  }

  &.dark {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--secondary-color);

    &:hover {
      background-color: var(--tertiary-color);
      border-color: var(--tertiary-color);
      color: var(--secondary-color);
    }
  }

  &.round {
    border-radius: 10em;
    padding: 0.7em 0.8em;
  }
  
  &.icon {
    border-radius: 0;
    padding: 0.5em 0.8em;
  }
}
</style>
