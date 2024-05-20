<template>
  <div class="loader-component">
    <div v-if="show" class="loader-inner">
      <div>
        <div class="loader-holder">
          <div class="loader"></div>
        </div>
        <p>{{ text }}</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show?: boolean;
    text?: string;
  }>(),
  {
    show: true,
    text: "Processing...",
  }
);
</script>

<style lang="scss" scoped>
.loader-inner {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background-color: #27272782;

  font-weight: bold;
  font-size: 1.1em;
  text-align: center;
  // background-color: ;
  /* HTML: <div class="loader"></div> */

  .loader-holder {
    display: inline-block;
  }
  .loader {
    width: 30px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--hover-color);
    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
  }
  @keyframes l3 {
    to {
      transform: rotate(1turn);
    }
  }
}
</style>
