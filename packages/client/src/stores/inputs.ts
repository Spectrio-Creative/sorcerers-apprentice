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

  const addInput = (input: InputTemplateValue, afterId?: string | 0) => {
    if (afterId) {
      const index = inputs.value.findIndex((i) => i.id === afterId);
      if (index !== -1) inputs.value.splice(index + 1, 0, input);
      return input;
    }

    if (afterId === 0) {
      inputs.value.unshift(input);
      return input;
    }

    inputs.value.push(input);
    // Remove fields that are not in the template overview
    cleanInputFields(input);

    return input;
  };

  const getPreviousInput = (input: InputTemplateValue | string) => {
    const inputId = typeof input === "string" ? input : input.id;
    const index = inputs.value.findIndex((i) => i.id === inputId);
    if (index === -1) return;
    return inputs.value[index - 1];
  };

  const removeInput = (input: InputTemplateValue | string) => {
    const index = inputs.value.findIndex((i) => (typeof input === "string" ? i.id === input : i.id === input.id));
    if (index !== -1) inputs.value.splice(index, 1);
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
    return addInput(createInputFromTemplate(template));
  };

  const findField = (input: InputTemplateValue, field: FieldQuickOverview, create = true) => {
    const headerTitle = field.tab ? `[${field.tab}] ${field.title}` : field.title;
    const fieldIndex = input.fields.findIndex((f) => {
      const fHeaderTitle = f.tab ? `[${f.tab}] ${f.title}` : f.title;
      return fHeaderTitle === headerTitle;
    });

    if (fieldIndex !== -1) return input.fields[fieldIndex];
    if (!create) return;
    const newField = {
      title: field.title,
      value: "",
      type: field.type,
      fullTitle: field.fullTitle,
      options: field.options,
      tab: field.tab,
      hidden: field.hidden,
    } as InputFieldValue;
    input.fields.push(newField);
    return newField;
  };

  const addOrUpdateField = (args: {
    template: TemplateOverview | InputTemplateValue;
    field: FieldQuickOverview;
    input?: InputTemplateValue;
    edit?: InputFieldEditables;
  }) => {
    const { template, field, edit } = args;
    const { value, hidden } = edit || {};
    const input = args.input || findInput(template);

    const inputField = findField(input, field) as InputFieldValue;
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
      const input = createInputFromTemplate(template);
      addOrSkipInput(input);
    });
  };

  const cleanInputFields = (input: InputTemplateValue | string) => {
    const inputId = typeof input === "string" ? input : input.id;
    const inputIndex = inputs.value.findIndex((i) => i.id === inputId);
    if (inputIndex === -1) return;
    // const template = sorcerer.overview.templates.find((t) => t.id === inputs.value[inputIndex].templateId);
    // if (!template) return;
    const templateOverview = inputs.value[inputIndex].templateOverview;
    inputs.value[inputIndex].fields = inputs.value[inputIndex].fields.filter((field) => {
      return templateOverview.some((f) => f.title === field.title);
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
      cleanInputFields(input);
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
    getPreviousInput,
    removeInput,
    cleanInputFields,
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
