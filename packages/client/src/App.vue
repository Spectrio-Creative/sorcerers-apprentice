<template>
  <div class="app">
    <div class="container">
      <Loader :show="app.processing" />
      <Button :on-click="refresh" :styles="['primary', 'round']"><RefreshIcon /></Button>
      <Spreadsheet ref="spreadsheet" v-if="type === 'spreadsheet'" />
      <Traditional ref="traditional" v-else />
      <div class="version">The Sorcerer’s Apprentice v{{ version }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loader from "./components/Loader.vue";
import Traditional from "./components/Panel/Traditional.vue";
import Spreadsheet from "./components/Panel/Spreadsheet.vue";
import { appStore } from "./stores/app";
import Button from "./components/Generic/Button.vue";
import { sorcererStore } from "./stores/sorcerer";
import RefreshIcon from "./components/Icons/RefreshIcon.vue";
import { Ref, onMounted, ref } from "vue";

const app = appStore();
const version = import.meta.env.VITE_APP_VERSION;
const sorcerer = sorcererStore();
const traditional: Ref<InstanceType<typeof Traditional> | null> = ref(null);
const spreadsheet = ref(null);

const refresh = async () => {
  app.processing = true;
  const traditionalBefore = traditional.value?.beforeRefresh();
  
  await sorcerer.refresh();

  if (traditionalBefore) traditional.value?.afterRefresh(traditionalBefore);
  app.processing = false;
};

defineProps<{
  type: "traditional" | "spreadsheet";
}>();

onMounted(() => {
  refresh();
});
</script>

<style lang="scss" scoped>
// --primary-color: #272727;
// --secondary-color: #c5c5c5;
// --tertiary-color: #161616;
// --highlight-color: #52a0e9;
// --hover-color: #9a9a9a;
.app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  // background-color: var(--tertiary-color);

  .mode-menu {
    .options {
      display: flex;
      // justify-content: center;
      margin: 1em 0;
      gap: 1em;
    }
  }

  .back-button {
    margin: 0 0 2em;
  }

  .container {
    position: relative;
    max-width: 1200px;
    width: calc(100% - 10em);
    margin: 0 auto;
    padding: 2em 5em;
    // background-color: var(--primary-color);

    .version {
      margin-top: 2rem;
      text-align: right;
      color: var(--hover-color);
    }
  }
}
</style>
