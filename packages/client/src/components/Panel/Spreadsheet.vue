<template>
  <div class="panel spreadsheet">
    <div class="spreadsheet-container">
      <template v-for="[template, innerInputs] in groupedInputs" :key="template.id">
        <div class="input-group">
          <div
            class="input-row input-headers"
            :style="`grid-template-columns: repeat(${getHeadersFromTemplate(template).length}, 15rem);`"
          >
            <div v-for="header in getHeadersFromTemplate(template)" class="input-header">{{ header }}</div>
          </div>
          <div
            class="input-row"
            v-for="input in innerInputs"
            :key="input.id"
            :style="`grid-template-columns: repeat(${getHeadersFromTemplate(template).length}, 15rem);`"
            :class="{ inactive: input.status !== 'Ready' }"
          >
            <div
              title="Reset Line"
              class="active-status"
              :class="inputStatusCSS(input.status)"
              @click="() => resetInputStatus(input)"
            ></div>
            <div class="input" v-for="header in getHeadersFromTemplate(template)">
              <TemplateField
                :field="getFieldFromTemplate(template, header)"
                :input="input"
                :inputKey="headerInputMap[header]"
                slim
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div style="display: flex; gap: 1em" v-if="!selectingTemplate">
      <Button :on-click="() => (selectingTemplate = true)">+</Button>
      <Button :on-click="inputs.processInputs">Process</Button>
      <Button :disabled="!someInputsNotReady" :on-click="inputs.setAllInputsReady">Re-Activate All</Button>
    </div>

    <DropDown
      v-else="selectingTemplate"
      :options="templateNames"
      :on-select="addTemplate"
      placeholder="Select Template"
      fixed
    />

    <!-- {{ inputs.inputs }} -->
  </div>
</template>

<script setup lang="ts">
import Button from "../Generic/Button.vue";
import { inputsStore } from "../../stores/inputs";
import { sorcererStore } from "../../stores/sorcerer";
import { computed, ref } from "vue";
import DropDown from "../Generic/DropDown.vue";
import { createInputFromTemplate } from "../../tools/input";
import TemplateField from "../Field/TemplateField.vue";

const headerInputMap: Record<string, 'templateName' | 'compName' | 'outputFile'> = {
  "Template Name": "templateName",
  "Comp Name": "compName",
  "Output File": "outputFile",
};

const inputs = inputsStore();
const sorcerer = sorcererStore();

const selectingTemplate = ref(false);

const templates = computed(() => sorcerer.overview.templates || []);
const templateNames = computed(() => templates.value.map((template) => template.name));

const groupedInputs = computed((): [TemplateOverview, InputTemplateValue[]][] => {
  const grouped: Record<string, InputTemplateValue[]> = {};
  inputs.inputs.forEach((input) => {
    if (!grouped[input.templateId]) grouped[input.templateId] = [];
    grouped[input.templateId].push(input);
  });
  const groupedArray = Object.entries(grouped).map(([id, input]) => {
    const template = sorcerer.overview.templates.find((template) => template.id === Number(id));

    return [template as TemplateOverview, input] as [TemplateOverview, InputTemplateValue[]];
  });

  console.log(groupedArray);

  return groupedArray;
});

const someInputsNotReady = computed(() => inputs.inputs.some((input) => input.status !== "Ready"));

const getHeadersFromTemplate = (template: TemplateOverview) => {
  const headers = ["Template Name", "Comp Name", "Output File"];
  const filteredFields = template.fields.filter((field) => field.type !== "Group");
  return headers.concat(filteredFields.map((field) => field.title));
};

const getFieldFromTemplate = (template: TemplateOverview, header: string) => {
  if (header === "Template Name")
    return { title: "Template Name", value: template.name, type: "Text", locked: true } as FieldQuickOverview;
  if (header === "Comp Name") return { title: "Comp Name", value: template.name, type: "Text" } as FieldQuickOverview;
  if (header === "Output File") return { title: "Output File", value: "~/", type: "Text" } as FieldQuickOverview;
  return (
    (template.fields.find((field) => field.title === header) as FieldOverview) ||
    ({ title: header, value: "", type: "Group" } as FieldQuickOverview)
  );
};

function addTemplate(templateName: string) {
  const template = sorcerer.overview.templates.find((template) => template.name === templateName);
  console.log(templateName, template);
  if (!template) return;
  const newInput = createInputFromTemplate(template);
  console.log(newInput);
  inputs.addInput(newInput);
  selectingTemplate.value = false;
}

const resetInputStatus = (input: InputTemplateValue) => {
  if (input.status === "Ready") return;
  input.status = "Ready";
};

const inputStatusCSS = (status?: InputStatus) => {
  return {
    ready: status === "Ready",
    processing: status === "Processing",
    complete: status === "Complete",
  };
};
</script>

<style lang="scss" scoped>
.panel {
  &.spreadsheet {
    overflow-y: visible;
    position: relative;
    .spreadsheet-container {
      overflow-x: scroll;
      padding: 2rem 2rem 300px;
      border: 1px solid var(--hover-color);
      margin-bottom: 2em;
      max-height: calc(100vh - 30rem);

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

      .actions {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        // align-items: flex-end;
        justify-content: flex-end;
        margin-bottom: 2rem;
      }

      .input-group {
        margin-bottom: 2rem;
      }

      .input-row {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 100px);
        gap: 1rem;
        margin-bottom: 0.5rem;

        .input-header {
          // text-align: center;
          font-weight: bold;
        }

        .input {
          position: relative;
        }

        .active-status {
          position: absolute;
          width: 0.8em;
          height: 0.8em;
          background-color: var(--tertiary-color);
          border-radius: 10em;
          top: 50%;
          left: 0;
          z-index: 1;
          transform: translate(calc(-100% - 0.5em), -50%);
          cursor: pointer;
          pointer-events: none;

          &.processing {
            background-color: var(--success-color);
          }

          &.complete {
            background-color: var(--highlight-color);
          }
        }

        &.inactive {
          .input {
            opacity: 0.5;
            pointer-events: none;
          }

          .active-status {
            pointer-events: initial;
          }
        }
      }
    }
  }
}
</style>
