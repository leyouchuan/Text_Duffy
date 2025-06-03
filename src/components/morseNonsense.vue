<template>
  <div
    class="morse-message"
    @mouseenter="showText = true"
    @mouseleave="showText = false"
    :title="originalText"
  >
    <div class="morse-sequence">
      <span
        v-for="(char, i) in displayedMorse"
        :key="i"
        class="morse-unit"
        :class="{
          dot: char === '.',
          dash: char === '-',
          space: char === ' '
        }"
      ></span>
    </div>
    <div v-if="showText" class="code-text">{{ originalText }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineExpose } from 'vue'

const nonsenseWords = [
  "blrrred", "flitzz", "knolish",
  "sshh", "drap", "tissle","-aww",
  "keld", "zing", "si-sap",
  "frzn", "glerd", "plint",
  "uze", "shard", "cppet",
  "faze", "tlick", "srrl",
  "bep", "dzy", "klim",
  "spwl", "fray"
]

const morseCodeMap: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.',
  g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..',
  m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
  s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..',
  ' ': ' ' // word space 
}

// props 接收一个“刷新触发”的信号，比如数字或字符串，或者也可以用函数直接刷新
const props = defineProps<{
  refreshSignal?: unknown
}>()

const showText = ref(false)
const originalText = ref('')
const fullMorseArray = ref<string[]>([])
const displayedMorse = ref<string[]>([])

function getRandomNonsense() {
  const count = 1+Math.floor(Math.random() * 1) // 2 or 3 words
  const words = []
  for(let i=0; i<count; i++){
    words.push(nonsenseWords[Math.floor(Math.random() * nonsenseWords.length)])
  }
  return words.join(' ')
}

function textToMorseWithSpaces(text: string) {
  return text.toLowerCase().split(' ').map(word =>
    word.split('').map(ch => morseCodeMap[ch] || '').join(' ')
  ).join('   ')  // 3 spaces = word gap
}

let timer: number | null = null

function startAnimation() {
  displayedMorse.value = []
  originalText.value = getRandomNonsense()
  const morseStr = textToMorseWithSpaces(originalText.value)
  fullMorseArray.value = morseStr.split('')

  let idx = 0
  if(timer) clearInterval(timer)
  timer = setInterval(() => {
    if (idx < fullMorseArray.value.length) {
      displayedMorse.value.push(fullMorseArray.value[idx])
      idx++
    } else {
      if(timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, 120)
}

// 初始化自动开始一次动画
onMounted(() => {
  startAnimation()
})

// 监听外部的刷新信号调用动画
watch(() => props.refreshSignal, () => {
  startAnimation()
})

defineExpose({
  refresh: startAnimation
})
</script>

<style scoped>
.morse-message {
  user-select: none;
  font-family: monospace;
  color: rgb(41, 43, 41);
  cursor: default;
  position: relative;
  padding: 6px 10px;
  background: #11111100;
  border-radius: 6px;
  max-width: 400px;
  white-space: nowrap;
}
.morse-sequence {
  display: flex;
  gap: 3px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.morse-unit {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  opacity: 0.5;
  background-color: rgb(33, 35, 33);
  transition: opacity 0.3s;
}
.morse-unit.dot {
  animation: blink 1.2s infinite;
}
.morse-unit.dash {
  width: 18px;
  border-radius: 3px;
  animation: blink 1.2s infinite;
}
.morse-unit.space {
  width: 4px;
  background-color: #444;
  opacity: 0.2;
  animation: none;
}

@keyframes blink {
  0%, 100% {opacity: 0.5;}
  50% {opacity: 1;}
}

.code-text {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  font-size: 0.9rem;
  color: rgb(248, 250, 248);
  background: rgba(0,0,0,0.8);
  padding: 6px 10px;
  border-radius: 4px;
  white-space: normal;
  max-width: 380px;
  user-select: text;
  pointer-events: none;
  opacity: 0.9;
}
</style>