import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import { fetchAMEFormatsData, refreshAMEFormatsData } from "../tools/api";

export const ameStore = defineStore("ame", () => {
  const presetObj: Ref<AMEFormatsObj> = ref({});

  const formats = computed(() => {
    return Object.keys(presetObj.value);
  });

  const getPresets = (format: string | undefined) => {
    return presetObj.value[format || ""] || [];
  };
  
  const loadPresets = async () => {
    const presets = await fetchAMEFormatsData();
    presetObj.value = presets;
  };

  const refreshPresets = async () => {
    const presets = await refreshAMEFormatsData();
    presetObj.value = presets;
  };

  const init = async () => {
    await loadPresets();
  };

  return {
    formats,
    getPresets,
    loadPresets,
    refreshPresets,
    init
  };
});
