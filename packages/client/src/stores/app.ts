import { defineStore } from "pinia";
import { computed, ComputedRef, Ref, ref } from "vue";

export const appStore = defineStore("app", () => {
  const processing: Ref<boolean> = ref(false);
  const messages: Ref<string[]> = ref([]);
  
  const processingMessage: ComputedRef<string> = computed(() => {
    const lastMessage = messages.value[messages.value.length - 1];
    return lastMessage || "Processing...";
  });

  const setProcessing = (value: boolean) => {
    processing.value = value;
  };

  const addProcessingMessage = (message: string): () => void => {
    messages.value.push(message);
    return () => {
      const index = messages.value.indexOf(message);
      if (index !== -1) messages.value.splice(index, 1);
    };
  };

  return {
    processing,
    processingMessage,
    setProcessing,
    addProcessingMessage
  };
});
