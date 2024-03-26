<template>
  <div class="toggle">
    <!-- Toggle Logic -->
    <label class="switch">
      <input ref="toggle" @click="updateValue" type="checkbox" />
      <span class="slider round"></span>
    </label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const value = defineModel({ default: false });
const toggle = ref<HTMLInputElement|null>(null);

watch(value, () => {
  if (toggle.value) {
    toggle.value.checked = value.value;
  }
});

const updateValue = () => {
  value.value = toggle.value?.checked || false;
};

onMounted(() => {
    if (toggle.value) {
        toggle.value.checked = value.value;
    }
});
</script>

<style scoped>
.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 2rem;
  height: 1rem;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color-light);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: calc(1rem - 4px);
  width: calc(1rem - 4px);
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
  background-color: var(--highlight-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
    box-shadow: 0 0 1px var(--highlight-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(1rem);
  -ms-transform: translateX(1rem);
  transform: translateX(1rem);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
