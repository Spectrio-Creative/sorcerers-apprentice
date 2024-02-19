import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const appStore = defineStore("app", () => {
  const processing: Ref<boolean> = ref(false);
  const processingMessage: Ref<string> = ref("");

  const setProcessing = (value: boolean) => {
    processing.value = value;
  };

  const setProcessingMessage = (message: string) => {
    processingMessage.value = message;
  };

  return {
    processing,
    setProcessing,
    setProcessingMessage
  };
});
