<template>
  <div class="dropdown">
    <div class="select-container" :class="{ cancelable: showCancel, slim }">
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
    </div>
    <CancelButton v-if="showCancel" @click="cancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import CancelButton from "./CancelButton.vue";

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

const allOptions = computed(() => {
  return [...props.options, ...addedOptions.value];
});

function addTag(newTag: string) {
  addedOptions.value.push(newTag);
  model.value = newTag;
}
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
      .multiselect__tags {
        height: 1.8rem;
        min-height: 1.8rem;
        background-color: var(--tertiary-color);
        border-color: var(--tertiary-color);
        border-radius: 0;
        font-size: 0.8rem;
        padding: 0;
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
