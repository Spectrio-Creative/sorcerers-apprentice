<template>
  <div class="panel traditional">
    <div class="templates">
      <Button
        v-for="template in templates"
        :text="template.name"
        :on-click="() => selectTemplate(template)"
        class="template-button"
        :selected="selectedTemplate === template"
      >
      </Button>
    </div>

    <div v-if="templates.length < 1">
      <h2>No templates found</h2>
      <p>
        Please add a template to your project and refresh the panel. For more information on how to add a template,
        please refer to the
        <a href="https://legacy.spectrio.com/creative/tools/sorcerers-apprentice/">documentation</a>.
      </p>
    </div>

    <div class="menu">
      <template v-for="input in inputs.inputs" :key="input.id">
        <div class="input-details" :class="{ shown: selectedTemplate?.id === input.templateId }">
          <div>Comp Name:</div>
          <div>Output File:</div>
          <TextInput v-model="input.compName" />
          <TextInput v-model="input.outputFile" />
        </div>
      </template>

      <div class="groups">
        <Button
          v-for="group in groups"
          :key="group.title"
          :text="group.title"
          :on-click="() => selectGroup(group)"
          class="group-button"
          :selected="selectedGroup?.title === group.title"
          :styles="['tab']"
        >
        </Button>
      </div>
      <template v-for="template in templates">
        <div class="field-menu" :class="{ shown: selectedTemplate?.id === template.id }">
          <template v-for="group in groupedFields(template)">
            <div class="field-box" :class="{ shown: selectedGroup?.title === group.title }">
              <TemplateField
                v-for="field in group.fields"
                :field="field"
                :input="inputs.findInput(template)"
              />
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="actions">
      <Button :disabled="templates.length < 1" :on-click="inputs.processInputs">Build Comp</Button>
      <Button :disabled="templates.length < 1" :on-click="renderComp">Render</Button>
    </div>
    <!-- {{ inputs.inputs }} -->
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import Button from "../Generic/Button.vue";
import TemplateField from "../Field/TemplateField.vue";
import { inputsStore } from "../../stores/inputs";
import TextInput from "../Generic/TextInput.vue";
import { appStore } from "../../stores/app";
import { sorcererStore } from "../../stores/sorcerer";

interface Group {
  title: string;
  fields: FieldOverview[];
}

const inputs = inputsStore();
const app = appStore();
const sorcerer = sorcererStore();

const selectedTemplate: Ref<TemplateOverview | null> = ref(null);
const selectedGroup: Ref<Group | null> = ref(null);

const templates = computed(() => {
  return sorcerer.overview.templates || [];
});

const groups = computed(() => {
  const groupMap: { [key: string]: Group } = {};
  selectedTemplate.value?.fields.forEach((field) => {
    const group = field.tab || `${field.type} Fields`;

    if (!groupMap[group]) {
      groupMap[group] = {
        title: group,
        fields: [],
      };
    }

    if (field.type === "Group") return;

    groupMap[group].fields.push(field);
  });

  return Object.values(groupMap);
});

const groupedFields = (template: TemplateOverview): Group[] => {
  const groupMap: { [key: string]: Group } = {};

  template.fields.forEach((field) => {
    const group = field.tab || `${field.type} Fields`;

    if (!groupMap[group]) {
      groupMap[group] = {
        title: group,
        fields: [],
      };
    }

    if (field.type === "Group") return;

    groupMap[group].fields.push(field);
  });

  return Object.values(groupMap);
};

const selectTemplate = (template: TemplateOverview) => {
  selectedTemplate.value = template;
  selectedGroup.value = groups.value[0];
  inputs.inputs.forEach((input) => {
    if (input.templateId === template.id) {
      input.status = "Ready";
      return;
    }
    input.status = "Disabled";
  });
};

const selectGroup = (group: Group) => {
  if (selectedGroup.value === group) {
    selectedGroup.value = null;
    return;
  }
  selectedGroup.value = group;
};

const beforeRefresh = () => {
  let selectedIndex = sorcerer.overview.templates.findIndex((template) => template === selectedTemplate.value);
  if (selectedIndex === -1) selectedIndex = 0;
  const groupIndex = selectedGroup.value
    ? groups.value.findIndex((group) => group.title === selectedGroup.value?.title)
    : 0;

    return { selectedIndex, groupIndex };
};

const afterRefresh = (options: {selectedIndex: number, groupIndex: number}) => {
  console.log("after refresh", options);
  selectedTemplate.value = sorcerer.overview.templates[options.selectedIndex];
  selectGroup(groups.value[options.groupIndex]);
  selectTemplate(selectedTemplate.value);
  app.processing = false;
};

defineExpose({
  beforeRefresh,
  afterRefresh,
})


const renderComp = async () => {
  // await buildComp();
  await inputs.processInputs();
  console.log("rendering comp");
  // sorcerer.renderComps();
};
</script>

<style lang="scss" scoped>
.panel {
  &.traditional {
    // padding: 2rem 0;

    .groups,
    .templates {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .menu {
      margin-top: 2rem;
    }

    .field-menu {
      display: none;
    }

    .field-box {
      border: 1px solid var(--hover-color);
      padding: 1rem;
      display: none;
    }

    .input-details {
      display: none;
    }

    .shown {
      display: block;
    }

    .shown.input-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
      // border-top: 1px solid var(--hover-color);
      // border-left: none;
      // border-right: none;
      // padding: 1rem;
    }

    .actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      // align-items: flex-end;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }
  }
}
</style>
