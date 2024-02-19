<template>
  <div v-if="!slim" class="field" :class="{ changed }">
    <ColorField
      v-if="field.type === 'Color'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <TextField
      v-else-if="field.type === 'Text'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :locked="field.locked"
    />
    <MediaField
      v-else-if="field.type === 'Media'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <FontField
      v-else-if="field.type === 'Font'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <div v-else>Unknown field type: {{ field.type }}</div>
  </div>
  <div v-if="slim" class="field" :class="{ changed }">
    <SlimColorField
      v-if="field.type === 'Color'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <SlimTextField
      v-else-if="field.type === 'Text'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :locked="field.locked"
    />
    <SlimMediaField
      v-else-if="field.type === 'Media'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <SlimFontField
      v-else-if="field.type === 'Font'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
    />
    <div v-else>Unknown field type: {{ field.type }}</div>
  </div>
</template>

<script setup lang="ts">
import ColorField from "./ColorField.vue";
import TextField from "./TextField.vue";
import MediaField from "./MediaField.vue";
import FontField from "./FontField.vue";
import SlimColorField from "./Slim/SlimColorField.vue";
import SlimTextField from "./Slim/SlimTextField.vue";
import SlimMediaField from "./Slim/SlimMediaField.vue";
import SlimFontField from "./Slim/SlimFontField.vue";
import { computed, onMounted, onUnmounted, watch } from "vue";
import { inputsStore } from "../../stores/inputs";

interface Props {
  field: FieldQuickOverview;
  slim?: boolean;
  input: InputTemplateValue;
  inputKey?: 'templateName' | 'compName' | 'outputFile';
  onChanged?: (value: string) => void;
  onRemoved?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  onChanged: () => {},
  onRemoved: () => {},
});

const model = defineModel({ default: "" });

const inputs = inputsStore();

const changed = computed(() => {
  return model.value !== props.field.value;
});

watch(model, () => {
  props.onChanged(model.value);
  
  if (props.inputKey) {
    props.input[props.inputKey] = model.value;
    return;
  }

  if (changed.value) {
    updateValue(model.value);
  } else {
    removeField();
  }
});

const updateValue = (value: string) => {
  inputs.addOrUpdateField({ template: props.input, field: props.field, value });
};

const removeField = () => {
  inputs.removeField({ template: props.input, field: props.field });
  props.onRemoved();
};

const onClear = () => {
  model.value = props.field.value;
};

onMounted(() => {
  model.value = props.field.value;
  inputs.subscribe(onClear);
});

onUnmounted(() => {
  inputs.unsubscribe(onClear);
});
</script>

<style lang="scss" scoped>
:deep(.input-field) {
  display: grid;
  align-items: center;
  margin-bottom: 1em;
  column-gap: 1.5em;
  gap: 1.5em;
  grid-template-columns: 100px 1fr;

  &.media-field {
    grid-template-columns: 100px 1fr 90px;
  }

  .input-label {
    width: 100px;
    text-align: right;
  }
}
.field {
  &.changed {
    :deep(.input-field) {
      .input-label {
        color: var(--highlight-color);
      }
    }
  }
}
</style>
