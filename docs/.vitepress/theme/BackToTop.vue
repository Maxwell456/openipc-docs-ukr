<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <!-- quadcopter (top view) -->
        <circle cx="5.5" cy="5.5" r="3"/>
        <circle cx="18.5" cy="5.5" r="3"/>
        <circle cx="5.5" cy="18.5" r="3"/>
        <circle cx="18.5" cy="18.5" r="3"/>
        <path d="M7.6 7.6 16.4 16.4 M16.4 7.6 7.6 16.4"/>
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.4"/>
        <!-- ascend arrow -->
        <path d="M12 13.6 V10.4 M10.6 11.6 12 10.2 13.4 11.6" stroke-width="1.8"/>
      </svg>
    </button>
  </Transition>
</template>
