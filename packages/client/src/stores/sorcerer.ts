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

  const audioAssets = computed(() => overview.value.libraryAssets.filter((a) => a.hasAudio && !a.hasVideo));
  const audioAssetNames = computed(() => audioAssets.value.map((a) => a.name));

  const videoAssets = computed(() => overview.value.libraryAssets.filter((a) => a.hasVideo));
  const videoAssetNames = computed(() => videoAssets.value.map((a) => a.name));

  const mediaAssets = computed(() => overview.value.libraryAssets.filter((a) => !a.hasAudio && !a.hasVideo));
  const mediaAssetNames = computed(() => mediaAssets.value.map((a) => a.name));

  const refresh = async (quiet = true) => {
    app.processing = true;
    app.setProcessingMessage("Refreshing Template Data...");

    const newData = await fetchSorcererData(quiet);
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
    audioAssets,
    audioAssetNames,
    videoAssets,
    videoAssetNames,
    mediaAssets,
    mediaAssetNames,
    refresh,
  };
});
