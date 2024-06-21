<template>
  <div class="media-field input-field" :class="{ slim, full: !slim }">
    <DropDown ref="selector" v-model="model" :options="options" :show-cancel="showCancel" :cancel="cancel" />
    <Button v-if="slim" :on-click="selectFile" :width="70" :styles="['icon']"><IconFolder /></Button>
    <Button v-else text="Browse" :on-click="selectFile" :width="125"></Button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import Button from "../Generic/Button.vue";
import DropDown from "../Generic/DropDown.vue";
import IconFolder from "../Icons/IconFolder.vue";
import { selectFile as selectFileAPI } from "../../tools/api";

const props = defineProps<{
  title: string;
  showCancel?: boolean;
  cancel?: () => void;
  fileType: SorcererFile;
  output?: boolean;
  options: string[];
  slim?: boolean;
}>();

const selector = ref<typeof DropDown | null>(null);

const selectFile = async () => {
  const fileInfo = await selectFileAPI(props.fileType);
  console.log("Finished fetching", fileInfo);

  if(!(fileInfo?.file)) return;

  selector.value?.addTag(fileInfo.file);

  // model.value = fileInfo.file;
};

const model = defineModel();
</script>

<style lang="scss" scoped>
.media-field {
  display: grid;
  grid-template-columns: 1fr 90px;

  &.slim {
    grid-template-columns: 1fr calc(70px - 3em);
    gap: 5px;
  }
}
</style>
