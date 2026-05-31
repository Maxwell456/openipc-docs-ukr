<script setup>
import { useData } from 'vitepress'
import { computed, ref, onUnmounted } from 'vue'

const { lang } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

const label    = computed(() => isUK.value ? 'Помилка?' : 'Bug?')
const tipText  = computed(() => isUK.value
  ? 'Виділіть текст і натисніть на кнопку'
  : 'Select text and press the button')
const issuePrefix = computed(() => isUK.value ? 'Помилка: ' : 'Error: ')

const showTip = ref(false)
let timer = null

function handleClick() {
  const text = window.getSelection()?.toString().trim() ?? ''

  if (!text) {
    showTip.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { showTip.value = false }, 3500)
    return
  }

  showTip.value = false
  const title = encodeURIComponent(issuePrefix.value + document.title)
  const body  = encodeURIComponent(
    `**Page:** ${window.location.href}\n\n` +
    `**Selected text:**\n> ${text}\n\n` +
    `**Description:**\n`
  )
  window.open(
    `https://github.com/Maxwell456/openipc-docs-ukr/issues/new?title=${title}&body=${body}`,
    '_blank',
    'noopener,noreferrer'
  )
}

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <Teleport to="body">
    <div class="report-float">

      <Transition name="tip-fade">
        <div v-if="showTip" class="report-tip">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ tipText }}
        </div>
      </Transition>

      <button class="report-float-btn" @click="handleClick" :aria-label="label">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span class="report-label">{{ label }}</span>
      </button>

    </div>
  </Teleport>
</template>
