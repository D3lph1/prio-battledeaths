<script setup>
import { VueFinalModal } from 'vue-final-modal'

defineProps({
    title: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <VueFinalModal
        class="confirm-modal"
        content-class="confirm-modal-content"
        overlay-transition="vfm-fade"
        content-transition="vfm-fade"
        @closed="emit('update:modelValue', false)"
    >
        <h1 class="text-xl">
            {{ title }}
        </h1>
        <slot />

        <button class="modal-btn" @click="emit('update:modelValue', false)" style="margin-top: 1rem">
            Done
        </button>
    </VueFinalModal>
</template>

<style>
.confirm-modal {
    display: flex;
    justify-content: center;
    align-items: center;
}
.confirm-modal-content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #fff;
    border-radius: 0.5rem;
    min-width: 450px;
}
.confirm-modal-content > * + *{
    margin: 0.5rem 0;
}
.confirm-modal-content h1 {
    font-size: 1.375rem;
}
.confirm-modal-content button {
    margin: 0.25rem 0 0 auto;
    padding: 0 8px;
    border: 1px solid;
    border-radius: 0.5rem;
}
.dark .confirm-modal-content {
    background: #000;
}

.modal-btn {
    display: inline-block;
    outline: 0;
    cursor: pointer;
    border: none;
    padding: 0 23px;
    height: 30px;
    line-height: 25px;
    border-radius: 7px;
    font-weight: 400;
    font-size: 16px;
    background: #fff;
    color: #696969;
    box-shadow: 0 4px 14px 0 rgb(0 0 0 / 10%);
    transition: background 0.2s ease,color 0.2s ease,box-shadow 0.2s ease;
    :hover{
        background: rgba(255,255,255,0.9);
        box-shadow: 0 6px 20px rgb(93 93 93 / 23%);
    }
}
</style>