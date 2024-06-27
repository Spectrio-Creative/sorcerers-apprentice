<template>
  <div class="dropdown">
    <div ref="multiselect" class="select-container" :class="{ cancelable: showCancel, slim }">
      <Tooltip :text="textOverflow ? model : ''" :max-width="500">
        <VueMultiselect
          class="multiselect"
          v-model="model"
          :options="allOptions"
          :placeholder="placeholder"
          :taggable="!fixed"
          @tag="addTag"
          tag-placeholder="Add this as new tag"
          @select="onSelect"
        >
        </VueMultiselect>
      </Tooltip>
    </div>
    <CancelButton v-if="showCancel" @click="cancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import CancelButton from "./CancelButton.vue";
import Tooltip from "./Tooltip.vue";

const props = withDefaults(
  defineProps<{
    options: string[];
    placeholder?: string;
    showCancel?: boolean;
    cancel?: () => void;
    fixed?: boolean;
    slim?: boolean;
    onSelect?: (value: string) => void;
  }>(),
  {
    placeholder: "Select one",
    showCancel: false,
    cancel: () => {},
    onSelect: () => {},
    fixed: false,
  }
);

const model = defineModel({ default: "" });
const addedOptions = ref<string[]>([]);
const multiselect = ref<HTMLElement | null>(null);

const allOptions = computed(() => {
  return [...props.options, ...addedOptions.value];
});

// Watch options for changes and change model if it's not in the list
watch(allOptions, (newOptions) => {
  if (!newOptions.includes(model.value)) {
    model.value = newOptions[0];
  }
});

function addTag(newTag: string) {
  addedOptions.value.push(newTag);
  model.value = newTag;
}

const textOverflow = computed(() => {
  if (!multiselect.value) return false;
  const $multiselect = $(multiselect.value);
  const single = $multiselect.find(".multiselect__single")[0];
  if (!single) {
    return (model.value?.length || 0) * .7 * 12 > multiselect.value.clientWidth;
  }
  const scrollWidth = single.scrollWidth || 0;
  const clientWidth = single.clientWidth || 0;
  const overflow = scrollWidth > clientWidth;
  return !!overflow;
});

defineExpose({ addTag });
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  .select-container {
    display: inline-block;
    width: calc(100%);

    &.cancelable {
      width: calc(100% - 32px);
    }

    :deep(.multiselect) {
      min-height: 1.8rem;

      &::after {
        position: absolute;
        content: "";
        top: 2px;
        right: 0;
        width: 2em;
        height: 1.5rem;
        z-index: 0;
        background: #161616cf;
      }

      .multiselect__tags {
        height: 1.8rem;
        min-height: 1.8rem;
        background-color: var(--tertiary-color);
        border-color: var(--tertiary-color);
        border-radius: 0;
        font-size: 0.8rem;
        padding: 0;
        overflow: hidden;
      }

      .multiselect__select {
        z-index: 5;
        height: 1.8rem;
        &::before {
          content: "";
          top: -5%;
          border: solid var(--secondary-color);
          border-width: 0 2px 2px 0;
          display: inline-block;
          padding: 2px;
          transform: rotate(45deg);
        }
      }

      .multiselect__placeholder,
      .multiselect__single {
        padding: calc(0.35rem - 2px) 1em;
        margin: 0;
        border-radius: 0;
      }

      .multiselect__single {
        background-color: var(--tertiary-color);
        color: var(--secondary-color);
        font-size: 0.8rem;
        text-wrap: nowrap;
      }

      input {
        background-color: var(--tertiary-color);
        color: var(--secondary-color);
        font-size: 0.8rem;
        padding: calc(0.35em - 2px) 1em;
        margin: 0;
        border-radius: 0;

        &::placeholder {
          color: var(--hover-color);
        }
      }

      .multiselect__content-wrapper {
        border-color: var(--tertiary-color);
        border-radius: 0;
        position: relative;

        .multiselect__option {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          min-height: 1.8rem;
          color: var(--secondary-color);
          background-color: var(--tertiary-color);

          &::after {
            line-height: 1.8rem;
          }
        }

        .multiselect__option--highlight {
          background-color: var(--highlight-color);
          color: var(--tertiary-color);

          &::after {
            content: "Press Enter to select";
            background-color: var(--highlight-color);
            position: absolute;
          }

          &.multiselect__option--selected {
            background-color: var(--error-color);
            color: #fff;

            &::after {
              content: "Press Enter to remove";
              background-color: var(--error-color);
            }
          }
        }
      }

      &.multiselect--active {
        input {
          border: 1px solid var(--highlight-color);
        }
        // .multiselect__content-wrapper {
        //     border-color: var(--highlight-color);
        // }

        &::after {
          right: 2px;
        }
      }
    }
  }

  .select-container.slim {
    :deep(.multiselect) {
      .multiselect__content-wrapper {
        .multiselect__option {
          &::after {
            display: none;
          }
        }
      }
    }
  }
}
</style>
