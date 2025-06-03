<template>
  <div class="fragmented-text">
    <span
      v-for="(word, wIndex) in words"
      :key="wIndex"
      class="word"
      :class="{ assembled: assembledIndices.has(wIndex) }"
      @click="assembleWord(wIndex)"
    >
      <span
        v-for="(fragment, fIndex) in fragments[wIndex]"
        :key="fIndex"
        class="fragment"
        :style="fragment.style"
        :class="{ assembled: assembledIndices.has(wIndex) }"
      >
        {{ fragment.char }}
      </span>
      <!-- 空格分隔 -->
      <span class="space"> </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// 传入的文本 props，用于拆分为碎片展示
const props = defineProps<{
  text: string
}>()

// 把文本拆成单词数组
const words = computed(() => props.text.trim().split(/\s+/))

// 碎片随机位置偏移和模糊半径范围
const OFFSET_RANGE = 6 // px
const BLUR_MAX = 2 // px

// 每个单词对应碎片数组
// 每个字符拆成2~4碎片。
// 简化：这里每字符直接拆成1个碎片，进行偏移和模糊来模拟碎片感。
const fragments = computed(() => {
  return words.value.map(word => {
    // 这样实现简单碎片，你可自行细化拆成更多碎片
    return word.split('').map(char => {
      // 随机偏移
      const offsetX = (Math.random() - 0.5) * 2 * OFFSET_RANGE
      const offsetY = (Math.random() - 0.5) * 2 * OFFSET_RANGE
      // 模糊大小随机
      const blur = Math.random() * BLUR_MAX

      return {
        char,
        style: {
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          filter: `blur(${blur}px)`
        }
      }
    })
  })
})

// 用户点击组装的单词索引集合
const assembledIndices = ref(new Set<number>())

function assembleWord(index: number) {
  assembledIndices.value.add(index)
}
</script>

<style scoped>
.fragmented-text {
  user-select: none;
  font-size: 18px;
  line-height: 1.5;
  cursor: default;
}
.word {
  display: inline-block;
  margin-right: 8px;
  cursor: pointer;
  position: relative;
}
.fragment {
  display: inline-block;
  transition:
    transform 0.5s ease,
    filter 0.5s ease;
  /* 碎片初始状态由style控制 */
}
/* 组装后碎片位置归0，模糊归0 */
.word.assembled .fragment,
.fragment.assembled {
  transform: translate(0, 0) !important;
  filter: blur(0) !important;
  cursor: default;
}

/* 空格看起来间距更自然 */
.space {
  white-space: pre;
}
</style>