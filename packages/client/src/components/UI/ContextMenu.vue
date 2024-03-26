<template>
  <div class="backdrop" :class="{ open }" @click="() => (open = false)" @contextmenu.prevent="() => open = false">
    <div @click.stop class="fixed h-1/3 z-50 context-menu" :style="{ top: position.y + 'px', left: position.x + 'px' }">
      <div class="context-menu-item" v-for="action in actions" :key="action.label" @click="() => doAction(action.action)">
        {{ action.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

const { actions, position } = defineProps<{
  actions: { action: () => void; label: string }[];
  position: { x: number; y: number };
}>();

const open = defineModel("open", { default: false });

const doAction = (action: () => void) => {
  action();
  open.value = false;
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  color: var(--secondary-color);

  &.open {
    display: block;
  }
}

.context-menu {
  position: absolute;
  background: white;
  background: var(--background-color);
  border: 1px solid var(--background-color);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 150px;

  .context-menu-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    background-color: var(--background-color-light);
    }
  }
}
</style>
