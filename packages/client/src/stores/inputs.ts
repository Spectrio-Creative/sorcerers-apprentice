import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { createInputFromTemplate } from "../tools/input";
import { sorcererStore } from "./sorcerer";
import { appStore } from "./app";
import { sendSorcererData } from "../tools/api";

export const inputsStore = defineStore("inputs", () => {
  const sorcerer = sorcererStore();
  const app = appStore();

  const inputs: Ref<InputTemplateValue[]> = ref([]);
  const clearSubscriptions: Array<() => void> = [];

  const clear = () => {
    inputs.value = [];
    clearSubscriptions.forEach((sub) => sub());
  };

  const subscribe = (sub: () => void) => {
    clearSubscriptions.push(sub);
  };

  const unsubscribe = (sub: () => void) => {
    const index = clearSubscriptions.indexOf(sub);
    if (index !== -1) clearSubscriptions.splice(index, 1);
  };

  const addInput = (input: InputTemplateValue) => {
    inputs.value.push(input);
    return input;
  };

  const addOrSkipInput = (input: InputTemplateValue) => {
    const index = inputs.value.findIndex((i) => i.id === input.id);
    if (index === -1) {
      inputs.value.push(input);
    }
  };

  const addOrUpdateInput = (input: InputTemplateValue) => {
    const index = inputs.value.findIndex((i) => i.id === input.id);
    if (index === -1) {
      inputs.value.push(input);
    } else {
      inputs.value[index] = input;
    }
  };

  const findInput = (template: TemplateOverview | InputTemplateValue) => {
    if ("templateId" in template) return template;
    const input = inputs.value.find((i) => i.templateId === template.id);
    if (input) return input;
    console.log("Creating input for template", template.name);
    return addInput(createInputFromTemplate(template));
  };

  const findField = (input: InputTemplateValue, field: FieldQuickOverview) => {
    const fieldIndex = input.fields.findIndex((f) => f.title === field.title);
    if (fieldIndex !== -1) return input.fields[fieldIndex];
    const newField = {
      title: field.title,
      value: "",
      type: field.type,
      fullTitle: field.fullTitle,
      hidden: field.hidden,
    } as InputFieldValue;
    input.fields.push(newField);
    return newField;
  };

  const addOrUpdateField = (args: {
    template: TemplateOverview | InputTemplateValue;
    field: FieldQuickOverview;
    edit?: InputFieldEditables;
  }) => {
    const { template, field, edit } = args;
    const { value, hidden } = edit || {};
    const input = findInput(template);

    const inputField = findField(input, field);
    inputField.value = value || "";
    if (hidden !== undefined) inputField.hidden = hidden;
  };

  const removeField = (args: { template: TemplateOverview | InputTemplateValue; field: FieldQuickOverview }) => {
    const { template, field } = args;
    const input = findInput(template);
    const fieldIndex = input.fields.findIndex((f) => f.title === field.title);
    if (fieldIndex !== -1) input.fields.splice(fieldIndex, 1);
  };

  const addNewTemplateInputs = () => {
    sorcerer.overview.templates.forEach((template) => {
      console.log("Adding template", template.name);
      console.log("Input Count", inputs.value.length);
      const input = createInputFromTemplate(template);
      addOrSkipInput(input);
    });
  };

  const postRefresh = (newData: SorcererOverview) => {
    // Remove inputs that are no longer in the overview
    inputs.value = inputs.value.filter((input) => {
      return newData.templates.some((template) => template.id === input.templateId);
    });

    // Remove fields that are no longer in the overview
    inputs.value.forEach((input) => {
      const template = newData.templates.find((t) => t.id === input.templateId);
      if (!template) return;
      input.templateName = template.name;
      input.fields = input.fields.filter((field) => {
        return template.fields.some((f) => f.title === field.title);
      });
    });
  };

  const processInputs = async () => {
    app.processing = true;
    const readyInputs = inputs.value.filter((i) => i.status === "Ready");

    for (const input of readyInputs) {
      input.status = "Processing";
      await sendSorcererData([input]);
      input.status = "Complete";
    }

    app.processing = false;
  };

  const setAllInputsReady = () => {
    inputs.value.forEach((input) => {
      input.status = "Ready";
    });
  };

  return {
    inputs,
    clear,
    subscribe,
    unsubscribe,
    addInput,
    findField,
    findInput,
    addOrSkipInput,
    addOrUpdateInput,
    addOrUpdateField,
    removeField,
    addNewTemplateInputs,
    postRefresh,
    processInputs,
    setAllInputsReady,
  };
});
