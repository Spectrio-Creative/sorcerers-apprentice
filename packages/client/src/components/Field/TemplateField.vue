<template>
  <div v-if="!slim" class="field traditional" :class="{ changed, visibleToggle }">
    <div class="field-title">{{ field.title }}</div>
    <div class="field-toggle" v-if="visibleToggle">
      <CheckBox v-model="visible" />
    </div>
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
      :options="sorcerer.videoAssetNames"
    />
    <MediaField
      v-else-if="field.type === 'Audio'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :options="sorcerer.audioAssetNames"
    />
    <MediaField
      v-else-if="field.type === 'Output'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :options="[]"
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
  <div v-if="slim" class="field spreadsheet" :class="{ changed, visibleToggle }" style="position: relative">
    <div class="field-toggle" v-if="visibleToggle">
      <CheckBox class="v-toggle" v-model="visible" />
    </div>
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
      :options="sorcerer.videoAssetNames"
    />
    <SlimMediaField
      v-else-if="field.type === 'Audio'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :options="sorcerer.audioAssetNames"
    />
    <SlimMediaField
      v-else-if="field.type === 'Output'"
      :title="field.title"
      v-model="model"
      :cancel="removeField"
      :show-cancel="changed"
      :options="[]"
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
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { inputsStore } from "../../stores/inputs";
import CheckBox from "../Generic/CheckBox.vue";
import { sorcererStore } from "../../stores/sorcerer";

interface Props {
  field: FieldQuickOverview;
  slim?: boolean;
  input: InputTemplateValue;
  inputKey?: "templateName" | "compName" | "outputFile";
  onChanged?: (value: string) => void;
  onRemoved?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  onChanged: () => {},
  onRemoved: () => {},
});

const model = defineModel({ default: "" });
const inputs = inputsStore();
const sorcerer = sorcererStore();

const visible = ref(!props.field.hidden);

const changed = computed(() => {
  return model.value !== props.field.value || visible.value !== !props.field.hidden;
});

const visibleToggle = computed(() => {
  return props.field.options?.includes("visible");
});

watch(visible, () => updateValue());

watch(model, () => {
  props.onChanged(model.value);

  if (props.inputKey) {
    props.input[props.inputKey] = model.value;
    return;
  }

  updateValue();
});

const updateValue = () => {
  if (!changed.value) {
    removeField();
    return;
  }

  inputs.addOrUpdateField({
    template: props.input,
    input: props.input,
    field: props.field,
    edit: {
      value: model.value,
      hidden: !visible.value,
    }
  });
};

const removeField = () => {
  inputs.removeField({ template: props.input, field: props.field });
  props.onRemoved();
  onClear();
};

const onClear = () => {
  model.value = props.field.value;
  visible.value = !props.field.hidden;
};

onMounted(() => {
  const inputValue = inputs.findField(props.input, props.field );

  if(props.inputKey) {
    model.value = props.input[props.inputKey] || props.field.value;
    return;
  }

  model.value = inputValue?.value || props.field.value;
  if (inputValue) visible.value = !inputValue.hidden;

  if (!changed.value) removeField();

  inputs.subscribe(onClear);
});

onUnmounted(() => {
  inputs.unsubscribe(onClear);
});
</script>

<style lang="scss" scoped>
.v-toggle {
  position: absolute;
  top: 0;
  left: 0;
}

.field {
  display: grid;
  align-items: center;

  &.spreadsheet {
    grid-template-columns: 1fr;
    gap: 1em;

    &.visibleToggle {
      grid-template-columns: 20px 1fr;
    }
  }

  &.traditional {
    margin-bottom: 1em;
    grid-template-columns: calc(120px + 1.5em) 1fr;
    column-gap: 1.5em;
    gap: 1.5em;

    .field-title {
      // font-weight: bold;
      text-align: right;
    }

    .field-toggle {
      width: 100%;
      // display: flex;
      // justify-content: center;
      // align-items: center;
    }

    &.visibleToggle {
      grid-template-columns: 100px 20px 1fr;
    }

    :deep(.input-field) {
      column-gap: 1.5em;
      align-items: center;
      gap: 1.5em;
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
}
</style>
