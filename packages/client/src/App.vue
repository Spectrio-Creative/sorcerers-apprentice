<template>
  <div class="app">
    <div class="container" @contextmenu.prevent="showContextMenu($event)">
      <!-- <div class="container"> -->
      <Loader :show="app.processing" :text="app.processingMessage" />
      <template v-if="!initialized">
        <div style="margin: auto; width: max-content; text-align: center; margin-top: 10em">
          <h2>The Sorcerer's Apprentice</h2>
          <p>Initialising...{{ initialized }}</p>
        </div>
      </template>
      <template v-else>
        <Button class="refresh-button" :on-click="() => refresh(false)" :styles="['tertiary', 'round']">
          <div class="inner">
            <RefreshIcon />
            <span>Refresh Panel</span>
          </div>
        </Button>
        <Spreadsheet ref="spreadsheet" v-if="type === 'spreadsheet'" />
        <Traditional ref="traditional" v-else />
        <div ref="versionEl" class="version">The Sorcerer’s Apprentice v{{ version }}</div>
        <ContextMenu v-model:open="showMenu" :actions="contextMenuActions" :position="menuPosition" />
        <div v-if="debugMode" class="debug">
          <div style="display: flex; align-items: center; gap: 2rem">
            <h2>Debug</h2>
            <Button :on-click="sayHello">Test</Button>
          </div>
          {{ inputs.inputs }}
        </div>
      </template>
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
import { Ref, onMounted, computed, ref } from "vue";
import { inputsStore } from "./stores/inputs";
import { ameStore } from "./stores/ame";
import { aeQuestion, sayHello } from "./tools/api";
import ContextMenu from "./components/UI/ContextMenu.vue";

const app = appStore();
const inputs = inputsStore();
const ame = ameStore();
const version = import.meta.env.VITE_APP_VERSION;
const sorcerer = sorcererStore();
const traditional: Ref<InstanceType<typeof Traditional> | null> = ref(null);
const spreadsheet = ref(null);
const debugMode = ref(false);
const versionEl: Ref<HTMLElement | null> = ref(null);
const showMenu = ref(false);
const contextMenuActions = computed<{ action: () => void; label: string }[]>(() => [
  { action: () => (debugMode.value = !debugMode.value), label: `${debugMode.value ? "Hide" : "Show"} Debug Info` },
]);
const menuPosition = ref({ x: 0, y: 0 });
const initialized = ref(false);

const showContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  showMenu.value = true;
  menuPosition.value = { x: event.clientX, y: event.clientY };
};

const refresh = async (quiet = false, setProcessing = true) => {
  if(setProcessing) app.processing = true;
  const traditionalBefore = traditional.value?.beforeRefresh();

  await sorcerer.refresh(quiet, setProcessing);

  if (traditionalBefore) traditional.value?.afterRefresh(traditionalBefore);
  if (setProcessing) app.processing = false;
};

defineProps<{
  type: "traditional" | "spreadsheet";
}>();

onMounted(async () => {
  app.processing = true;
  const clearMessage = app.addProcessingMessage("Initialising...");
  refresh(true, false);
  const fetched = await ame.init();
  console.log("AME fetched", fetched);
  if (!fetched) {
    const buildList = await aeQuestion(`AME Format cache file not found. Would you like to initialise it now? This will open AME and clear your current queue.`);
    if (buildList) {
      await ame.refreshFormats();
    }
  }
  console.log("AME Formats:", ame.formats);
  clearMessage();
  initialized.value = true;
  app.processing = false;
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

.refresh-button {
  margin: 0 0 2em;

  .inner {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
}
</style>
