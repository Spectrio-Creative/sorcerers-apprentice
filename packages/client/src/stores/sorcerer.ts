import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { fetchSorcererData } from "../tools/api";
import { appStore } from "./app";
import { inputsStore } from "./inputs";

export const sorcererStore = defineStore("sorcerer", () => {
  const app = appStore();
  const inputs = inputsStore();

  const projectPath = ref("");

  const overview: Ref<SorcererOverview> = ref({
    templates: [],
    fonts: [],
    libraryAssets: [],
  });

  const fonts = computed(() => overview.value.fonts);
  const fontNames = computed(() => fonts.value.map((f) => f.font));

  const libraryAssets = computed(() => overview.value.libraryAssets);
  const libraryAssetNames = computed(() => libraryAssets.value.map((a) => a.name));

  const refresh = async () => {
    app.processing = true;
    app.setProcessingMessage("Refreshing Template Data...");

    const newData = await fetchSorcererData();
    console.log("fetched data", newData);
    overview.value = newData;

    inputs.postRefresh(newData);
    
    app.processing = false;
  };

  return {
    projectPath,
    overview,
    fonts,
    fontNames,
    libraryAssets,
    libraryAssetNames,
    refresh,
  };
});
