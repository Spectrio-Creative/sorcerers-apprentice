<template>
    <div class="modal" :class="{open: openState}" @click="close">
        <div class="inner" @click.stop>
            <slot></slot>
            <Button v-if="!noClose" :on-click="close">Close</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '../Generic/Button.vue';
withDefaults(defineProps<{
    noClose: boolean;
}>(), {
    noClose: false
})
const openState = defineModel({default: false})

const close = () => {
    openState.value = false;
}
</script>

<style lang="scss" scoped>

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);

    .inner {
        /* margin: 15% auto; */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border: 1px solid #888;
        width: calc(100% - 6rem);
        max-width: 500px;

        border: 1px solid var(--secondary-color);
        color: var(--secondary-color);
        text-decoration: none;
        text-align: center;
        border-radius: 0;
        background-color: var(--background-color);
    }

    &.open {
        display: block;
    }
}

</style>