<template>
  <Modal v-model="exportModal" no-close>
    <div class="inner">
      <h2>Export CSV(s)</h2>
      <p>Click the button below to export the current rows or template defaults to a CSV file.</p>
      <div style="display: grid; gap: 0.5rem">
        <Toggle v-model="exportRows">Export Current Rows</Toggle>
        <Toggle v-model="exportDemos">Export Template Defaults</Toggle>
        <Toggle v-model="exportGrouped">Group Similar Templates in the same CSV</Toggle>
        <div style="display: flex; gap: 0.5rem; justify-content: center">
          <Button :on-click="exportCSV">Export</Button>
          <Button :on-click="() => (exportModal = false)">Close</Button>
        </div>
      </div>
    </div>
  </Modal>
  <div class="top-menu">
    <div class="csv-panel">
      <Button :on-click="openExportModal">Export CSV(s)</Button>
      <Button :on-click="importCSV">Import CSV(s)</Button>
    </div>
  </div>
  <div class="panel spreadsheet">
    <div class="spreadsheet-container">
      <div class="template-group" v-for="[template, innerInputs, headers] in groupedInputs" :key="template.id">
        <div class="input-group">
          <div class="input-row input-headers">
            <div v-for="header in headers" class="input-header">{{ header }}</div>
          </div>
          <div
            class="input-row"
            v-for="input in innerInputs"
            :key="input.id"
            :class="{ inactive: input.status !== 'Ready' }"
            @contextmenu.stop.prevent="showContextMenu($event, input)"
          >
            <div
              title="Reset Line"
              class="active-status"
              :class="inputStatusCSS(input.status)"
              @click="() => toggleInputStatus(input)"
            ></div>
            <div class="input" v-for="header in headers">
              <TemplateField
                :field="getFieldFromTemplate(template, header)"
                :inputKey="headerInputMap[header]"
                :input="input"
                slim
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-menu" style="display: grid; grid-template-columns: 1fr" v-if="!selectingTemplate">
      <div class="left" style="display: flex; gap: 1em">
        <Button :on-click="() => (selectingTemplate = true)">+</Button>
        <Button :on-click="inputs.processInputs">Create Comps</Button>
        <Button :on-click="() => inputs.processInputs(true)">Queue in AME</Button>
        <Button :on-click="() => inputs.processInputs(true, true)">Render in AME</Button>
        <Button :disabled="!someInputsNotReady" :on-click="inputs.setAllInputsReady">Re-Activate All</Button>
        <Button v-if="disabledRows.length" type="danger" :on-click="deleteRows">Delete Rows</Button>
      </div>
    </div>

    <DropDown
      v-else="selectingTemplate"
      :options="templateNames"
      :on-select="addTemplate"
      placeholder="Select Template"
      fixed
    />

    <ContextMenu v-model:open="showMenu" :actions="contextMenuActions" :position="menuPosition" />
  </div>
</template>

<script setup lang="ts">
import Button from "../Generic/Button.vue";
import Toggle from "../Generic/Toggle.vue";
import Modal from "../UI/Modal.vue";
import ContextMenu from "../UI/ContextMenu.vue";
import { inputsStore } from "../../stores/inputs";
import { sorcererStore } from "../../stores/sorcerer";
import { computed, ref } from "vue";
import DropDown from "../Generic/DropDown.vue";
import { createInputFromTemplate, getTemplateRow } from "../../tools/input";
import { getFieldFromTemplate } from "../../tools/field";
import TemplateField from "../Field/TemplateField.vue";
import * as Papa from "papaparse";
import { aeAlert, saveFile } from "../../tools/api";
import { nanoid } from "nanoid";
import clone from "just-clone";

const headerInputMap: Record<string, "templateName" | "compName" | "outputFile" | "outputFormat" | "outputPreset"> = {
  "Template Name": "templateName",
  "Comp Name": "compName",
  "Output File": "outputFile",
  "Output Format": "outputFormat",
  "Output Preset": "outputPreset",
};

const inputs = inputsStore();
const sorcerer = sorcererStore();

const selectingTemplate = ref(false);
const exportModal = ref(false);
const exportRows = ref(true);
const exportDemos = ref(false);
const exportGrouped = ref(true);

const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const targetInput = ref(null as null | InputTemplateValue);
const copiedInput = ref(null as null | InputTemplateValue);
const contextMenuActions = computed(() => {
  const actions = [
    { label: "Copy Row", action: copyInput },
    { label: "Duplicate Row", action: duplicateInput },
  ];

  if (copiedInput.value) {
    actions.push({ label: "Paste Copied Row", action: pasteInput });
  }

  actions.push({ label: "Delete", action: deleteInput });

  return actions;
});

const showContextMenu = (event: MouseEvent, input: InputTemplateValue) => {
  event.preventDefault();
  showMenu.value = true;
  targetInput.value = input;
  menuPosition.value = { x: event.clientX, y: event.clientY };
};

function copyInput() {
  copiedInput.value = clone(targetInput.value as InputTemplateValue);
}

function pasteInput() {
  if (!targetInput.value || !copiedInput.value) return;
  const targetId = targetInput.value.id;
  const newInput = clone(copiedInput.value);
  newInput.id = nanoid();
  newInput.templateName = targetInput.value.templateName;
  newInput.templateOverview = clone(targetInput.value.templateOverview);
  newInput.templateId = targetInput.value.templateId;

  // Purge incompatible fields
  newInput.fields = newInput.fields.filter((field) =>
    newInput.templateOverview.some((templateField) => templateField.title === field.title)
  );

  targetInput.value = newInput;

  const previousId = inputs.getPreviousInput(targetId)?.id || 0;
  inputs.removeInput(targetId);
  inputs.addInput(newInput, previousId);
}

function duplicateInput() {
  if (!targetInput.value) return;
  const newInput = { ...targetInput.value };
  newInput.id = nanoid();
  inputs.addInput(newInput, targetInput.value.id);
}

function deleteInput() {
  if (!targetInput.value) return;
  const inputId = targetInput.value.id;
  inputs.removeInput(inputId);
}

const templates = computed(() => sorcerer.overview.templates || []);
const templateNames = computed(() => templates.value.map((template) => template.name));

const groupedInputs = computed((): [TemplateOverview, InputTemplateValue[], string[]][] => {
  const grouped: Record<string, InputTemplateValue[]> = {};
  inputs.inputs.forEach((input) => {
    if (!grouped[input.templateId]) grouped[input.templateId] = [];
    grouped[input.templateId].push(input);
  });
  const groupedArray = Object.entries(grouped).map(([id, input]) => {
    const template = sorcerer.overview.templates.find((template) => template.id === Number(id));
    const headers = getHeadersFromTemplate(template as TemplateOverview);

    return [template as TemplateOverview, input, headers] as [TemplateOverview, InputTemplateValue[], string[]];
  });

  return groupedArray;
});

const someInputsNotReady = computed(() => inputs.inputs.some((input) => input.status !== "Ready"));

const getHeadersFromTemplate = (
  template: TemplateOverview,
  headerType: "title" | "fullTitle" | "[tabs] title" = "[tabs] title"
) => {
  const headers = ["Template Name", "Comp Name", "Output File", "Output Format", "Output Preset"];
  const filteredFields = template.fields.filter((field) => field.type !== "Group");
  return headers.concat(
    filteredFields.map((field) => {
      if (headerType === "[tabs] title") return field.tab ? `[${field.tab}] ${field.title}` : field.title;
      if (headerType === "fullTitle") return field.fullTitle;
      return field.title;
    })
  );
};

function addTemplate(templateName: string, fields?: { [key: string]: string }) {
  const template = sorcerer.overview.templates.find((template) => template.name === templateName);

  if (!template) {
    aeAlert(`Template ${templateName} not found. Skipping.`);
    return;
  }

  const newInput = createInputFromTemplate(template);

  if (fields) {
    const compName = getTemplateRow(fields, /^comp ?name$/i);
    if (compName.name) newInput.compName = compName.name;
    if (compName.key) delete fields[compName.key];

    const outputFile = getTemplateRow(fields, /^output ?file$/i);
    if (outputFile.name) newInput.outputFile = outputFile.name;
    if (outputFile.key) delete fields[outputFile.key];
  }

  for (const [key, value] of Object.entries(fields || {})) {
    const field = getFieldFromTemplate(template, key, value);
    newInput.fields.push(field);
  }

  console.log(`Adding input: ${newInput.id}`);
  inputs.addInput(newInput);
  selectingTemplate.value = false;
}

const toggleInputStatus = (input: InputTemplateValue) => {
  if (input.status === "Processing") return;
  if (input.status === "Complete") input.status = "Ready";
  else if (input.status === "Ready") input.status = "Disabled";
  else if (input.status === "Disabled") input.status = "Complete";
  else input.status = "Ready";
};

const inputStatusCSS = (status?: InputStatus) => {
  return {
    ready: status === "Ready",
    processing: status === "Processing",
    complete: status === "Complete",
    disabled: status === "Disabled",
  };
};

const importCSV = () => {
  // Open file dialog
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".csv";
  file.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      const parsed = Papa.parse(result, { header: true });
      (parsed.data as { [key: string]: string }[]).forEach((row) => {
        const template = getTemplateRow(row, /^template ?(?:name)?$/i);
        if (!template.name) {
          aeAlert("No Template Name found in CSV. Skipping.");
          return;
        }
        addTemplate(template.name, row);
      });
    };
    reader.readAsText(target.files[0]);
  };
  file.click();
};

const openExportModal = () => {
  if (!inputs.inputs.length) {
    exportRows.value = false;
    exportDemos.value = true;
  } else {
    exportRows.value = true;
    exportDemos.value = false;
  }

  exportModal.value = true;
};

const exportCSV = () => {
  exportModal.value = false;
  const inputsToRemove: string[] = [];

  if (!exportRows.value && !exportDemos.value) {
    aeAlert("Please select at least one option to export.");
    return;
  }

  if (exportDemos.value) {
    for (const template of sorcerer.overview.templates) {
      const newInput = createInputFromTemplate(template);
      inputs.addInput(newInput);
      inputsToRemove.push(newInput.id);
    }
  }

  if (!inputs.inputs.length) {
    aeAlert("No rows to export.");
    return;
  }

  // Open file dialog
  const rows = inputs.inputs
    .map((input) => {
      const template = sorcerer.overview.templates.find((template) => template.id === input.templateId);
      if (!template) return;
      const row: { [key: string]: string } = {
        "Template Name": input.templateName,
        "Comp Name": input.compName || "",
        "Output File": input.outputFile || "",
      };

      input.templateOverview.forEach((field) => {
        row[field.headerTitle] = field.defaultValue;
      });

      input.fields.forEach((field) => {
        const visiblePrefix = field.options?.includes("visible") ? `[${field.hidden ? "" : "x"}] ` : "";
        const tab = field.tab ? `[${field.tab}] ` : "";
        row[`${tab}${field.title}`] = visiblePrefix + field.value;
      });

      return row;
    })
    .filter((row) => row !== undefined) as { [key: string]: string }[];

  // Separate into groups based on the row headers
  const groups: Record<string, { [key: string]: string }[]> = {};
  // Sort rows by largest number of keys to smallest
  rows.sort((a, b) => Object.keys(b).length - Object.keys(a).length);
  rows.forEach((row) => {
    const rowKeys = Object.keys(row);

    for (const [key, group] of Object.entries(groups)) {
      if (!exportGrouped.value) {
        const templateName = row["Template Name"];
        if (key === templateName) {
          groups[templateName].push(row);
          return;
        }

        continue;
      }

      const groupKeys = Object.keys(group[0]);
      if (rowKeys.every((key) => groupKeys.includes(key))) {
        // If template name is not the same, rename the group to include both
        const templatesInKey = key.split(" +++ ");
        if (!templatesInKey.includes(row["Template Name"])) {
          const newGroupName = `${key} +++ ${row["Template Name"]}`;
          groups[newGroupName] = group;
          delete groups[key];
        }

        group.push(row);
        return;
      }
    }

    const templateName = row["Template Name"];

    groups[templateName] = [row];
  });

  for (const [key, group] of Object.entries(groups)) {
    const csv = Papa.unparse(group);
    saveFile({ data: csv, fileName: `${key.replace("+++", "+")}.csv`, type: "csv" });
  }

  for (const id of inputsToRemove) {
    inputs.removeInput(id);
  }
};

const disabledRows = computed(() => inputs.inputs.filter((input) => input.status === "Disabled"));

const deleteRows = () => {
  const inputIds = disabledRows.value.map((input) => input.id);
  inputIds.forEach((id) => inputs.removeInput(id));
};
</script>

<style lang="scss" scoped>
.top-menu {
  text-align: right;
  margin-top: -4em;
  margin-bottom: 2em;

  .csv-panel {
    display: inline-flex;
    gap: 1em;
    align-items: center;
    justify-content: end;
    font-size: 0.8em;
    position: relative;
  }
}

// .csv-panel {
//   display: flex;
//   gap: 1em;
//   align-items: center;
//   justify-content: end;
//   font-size: 0.8em;
//   position: relative;
//   margin-top: -5em;
//   margin-bottom: 2.5em;
// }

.panel {
  &.spreadsheet {
    overflow-y: visible;
    position: relative;
    .spreadsheet-container {
      overflow-x: scroll;
      padding: 2rem;
      border: 1px solid var(--hover-color);
      margin-bottom: 2em;
      max-height: calc(100vh - 17rem);
      height: calc(100vh - 17rem);

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

      .template-group {
        margin-bottom: 1.5rem;
        // Last of type has no margin
        &:last-of-type {
          margin-bottom: 0;
        }

        .input-group {
          margin-right: 2rem;
        }
      }

      .input-row {
        position: relative;
        // display: grid;
        // grid-template-columns: repeat(3, 100px);
        display: inline-flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        margin-right: 2rem;

        .input-header {
          font-weight: bold;
        }

        .input-header,
        .input {
          position: relative;
          width: 15rem;
          // flex-basis: 15rem;
          flex-grow: 0;
          flex-shrink: 0;
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
          // pointer-events: none;

          &.processing {
            background-color: var(--success-color);
          }

          &.complete {
            background-color: var(--highlight-color);
          }

          &.disabled {
            background-color: var(--error-color);
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

    :deep(.dropdown .select-container .multiselect .multiselect__content-wrapper) {
      position: absolute;
    }
  }
}
</style>
