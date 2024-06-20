import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import { fetchAMEPresetData, refreshAMEPresetData } from "../tools/api";

export const ameStore = defineStore("ame", () => {
  const presetObj: Ref<AMEPresetObj> = ref({});

  const formats = computed(() => {
    return Object.keys(presetObj.value);
  });

  const getPresets = (format: string | undefined) => {
    return presetObj.value[format || ""] || [];
  };
  
  const loadPresets = async () => {
    const presets = await fetchAMEPresetData();
    presetObj.value = presets;
  };

  const refreshPresets = async () => {
    const presets = await refreshAMEPresetData();
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
