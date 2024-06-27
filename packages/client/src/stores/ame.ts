import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import { fetchAMEFormatsData, refreshAMEFormatsData } from "../tools/api";

export const ameStore = defineStore("ame", () => {
  const presetObj: Ref<AMEFormatsObj> = ref({timestamp: `${new Date()}`, formats: {}});

  const formats = computed(() => {
    return Object.keys(presetObj.value.formats || {});
  });

  const defaultFormat = computed(() => {
    return formats.value.find((f) => /h\.264/i.test(f)) || formats.value[0] || "";
  });

  const getPresets = (format: string | undefined) => {
    if (!presetObj.value.formats) return [];
    return presetObj.value.formats[format || ""] || [];
  };
  
  const loadFormats = async () => {
    const presets = await fetchAMEFormatsData();
    presetObj.value = presets || {timestamp: `${new Date()}`, formats: {}};
  };

  const refreshFormats = async () => {
    const presets = await refreshAMEFormatsData();
    presetObj.value = presets;
  };

  const init = async () => {
    await loadFormats();
    const numOfFormats = Object.keys(presetObj.value?.formats || {}).length;
    const empty = numOfFormats === 0;
    return !empty;
  };

  return {
    formats,
    defaultFormat,
    getPresets,
    loadFormats,
    refreshFormats,
    init
  };
});
