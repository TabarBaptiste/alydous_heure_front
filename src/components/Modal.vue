<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 class="text-xl font-semibold mb-2">{{ title }}</h2>
            <p class="mb-4">{{ message }}</p>
            <button @click="close" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                OK
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const closeCallback = ref(null)

function show(t, msg, onClose = null) {
    title.value = t
    message.value = msg
    visible.value = true
    closeCallback.value = onClose
}

function close() {
    visible.value = false
    if (closeCallback.value) closeCallback.value()
}

defineExpose({ show }) // 👈 permet d'appeler show() depuis le parent
</script>
