<template>
  <template v-if="text">
    <div class="tooltip-box" @mouseenter="start" @mouseleave="end">
      <div class="tooltip" :style="extraClasses">{{ text }}</div>
      <div ref="hoverer">
        <slot></slot>
      </div>
    </div>
  </template>
  <template v-else>
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";

defineProps<{ text?: string }>();

const hoverer = ref<HTMLElement | null>(null);
const extraClasses = ref("");
const hovering = ref(false);

const start = () => {
  hovering.value = true;
  setTimeout(activateTooltip, 1000);
};

const end = () => {
  hovering.value = false;
  deactivateTooltip();
};

const activateTooltip = () => {
  if (!hovering.value) return;
  extraClasses.value = "opacity: 0.7;";
};

const deactivateTooltip = () => {
  extraClasses.value = "";
};

onMounted(() => {
  activateTooltip();

  setTimeout(() => {
    deactivateTooltip();
  }, 2000);
});
</script>

<style lang="scss" scoped>
.tooltip-box {
  position: relative;
  .tooltip {
    position: absolute;
    width: max-content;
    max-width: 200px;
    top: -2.5em;
    left: 50%;
    transform: translateX(-50%);
    // min-width: 200px;
    z-index: 20;
    color: white;
    background: black;
    border-radius: 0.5em;
    padding: 0.3em 1em;
    opacity: 0;
    transition: 0.5s opacity;
  }
}
</style>
