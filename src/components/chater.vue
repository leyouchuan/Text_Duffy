<template>
    <div class="container">
    <div class="status-bar">
      <div class="status-left">
      <span class="sim-status">Duffy</span>
    </div>
    <div class="status-center">2005</div>
    <div class="status-right">
      <span class="wifi">📶</span> 
      <span class="battery">🔋</span>
    </div>
  <div class="stars">
  <div class="star" style="top: 10%; left: 20%;"></div>
  <div class="star" style="top: 25%; left: 50%; width:3px; height:3px;"></div>
  <div class="star" style="top: 40%; left: 35%;"></div>
  <div class="star" style="top: 60%; left: 75%; width:1.5px; height:1.5px;"></div>
  <div class="star" style="top: 80%; left: 55%;"></div>
  <div class="star" style="top: 85%; left: 15%; width:3px; height:3px;"></div>
  <div class="star" style="top: 30%; left: 70%;"></div>
  <div class="star" style="top: 50%; left: 90%; width:2.5px; height:2.5px;"></div>
</div>
  </div>
  <div class="header">
   <button class="back-btn">Return</button>
    <div class="title">TEXT</div>
  </div>
    <div class="chat" ref="chatRef">
        <div v-for="(msg, idx) in history" :key="idx"
        :class="['message-row', typeof msg === 'string' ? 'user-row' : 'ai-row']"
        >
        <div class="avatar">
        <img 
        v-if="typeof msg === 'string'"
            src="/user.png" alt="User" />
            <img 
        v-else
        src="/user.png" alt="AI" />
        </div>
  <div class="bubble">
    <template v-if="typeof msg === 'string'">
      {{ msg }}
    </template>
    <template v-else>
      <MorseNonsenseMessage :refreshSignal="msg.id" />
    </template>
  </div>
        </div>
    </div>
    <div class="input-box">
    <input
     class="input-area"
      type="text"
      v-model="inputValue"
      @input="onInput"
      @keydown.enter.prevent="onEnter"
      ref="inputAreaRef"
      autocomplete="off"
      spellcheck="false"
      placeholder="Text here..."
    />
    <div class="bubble_current">{{ tempText||' ' }}</div>
    </div>
  </div>
  <audio id="typeSound" src="/typesound.mp3" preload="auto"></audio>
  <audio id="brokenChordSound" src="/notification.mp3" preload="auto"></audio>
</template>

<script setup lang="ts">
import { ref, nextTick ,onMounted} from 'vue'
import MorseNonsenseMessage from './morseNonsense.vue'

const history = ref<(string | { id: number })[]>([])
const tempText = ref('')
const inputValue = ref('')
const chatRef = ref<HTMLDivElement | null>(null)
const inputAreaRef = ref<HTMLInputElement | null>(null)  // 绑定到输入框
let typeSound: HTMLAudioElement | null = null
let brokenChordSound: HTMLAudioElement | null = null


let currentPos = 0
const replacementText = `I tend the mobile now
like an injured bird

We text, text, text
our significant words.

I re-read your first,
your second, your third,

look for your small xx,
feeling absurd.

The codes we send
arrive with a broken chord.

I try to picture your hands,
their image is blurred.

Nothing my thumbs press
will ever be heard.
`

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    }
  })
}

onMounted(() => {
  typeSound = document.getElementById('typeSound') as HTMLAudioElement
  brokenChordSound = document.getElementById('brokenChordSound') as HTMLAudioElement
  if (inputAreaRef.value) {
    inputAreaRef.value.addEventListener('keydown', () => {
      if (typeSound) {
        typeSound.currentTime = 0
        typeSound.play()
      }
    })
  }
})

function onInput() {
  if (currentPos < replacementText.length) {
    tempText.value += replacementText[currentPos]
    currentPos++
  }
  inputValue.value = ''
  scrollToBottom()
}

let aiId = 0
function onEnter() {
  if (tempText.value.trim() === '') return

  // 用户消息
  history.value.push(tempText.value)
  tempText.value = ''

  // AI消息
  aiId++
  history.value.push({ id: aiId })

  // 播放断奏和弦音效
  if (brokenChordSound) {
    brokenChordSound.currentTime = 0
    brokenChordSound.play()
  }

  scrollToBottom()
}
</script>

<style scoped>
body, html {
  background: #c0c0c0; /* 浅灰底，模拟旧电脑桌面 */
  font-family: 'Courier New', Courier, monospace;
  color: #000;
  margin: 0; padding: 0;
}

.container {
  width: 600px;
  height: 90vh; /* 设置最小高度，确保可见 */
  margin: 20px auto;
  background: #e0e0e0; /* 稍微深一点的灰色，增加对比度 */
  border: 2px solid #fff; 
  box-shadow:
    inset 2px 2px 5px #9f9f9f, 
    inset -2px -2px 5px #fff;   
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
/* 顶部标题栏 
.header {
  background: linear-gradient(to bottom,#9db8d1,#6e85b7);
  color: black;
  font-weight: bold;
  font-size: 13px;
  padding: 6px 8px;
  border-bottom: 2px solid #91a7d0;
  box-shadow: inset 1px 1px white, inset -1px -1px #4a5e82;
  display: flex;
  justify-content: space-between;
  user-select: none;
}*/

/* 复古渐变状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
  color: #333;
  background: linear-gradient(180deg, #c0c8d7 0%, #9da5b7 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}

.status-left, .status-center, .status-right {
  display: flex;
  align-items: center;
}

.status-left span:not(:last-child) {
  margin-right: 5px;
}

/* header */
.header {
  background: linear-gradient(to bottom,#9db8d1,#6e85b7);
  color: black;
  font-size: 13px;
  padding: 6px 8px;
  border-bottom: 2px solid #91a7d0;
  box-shadow: inset 1px 1px white, inset -1px -1px #4a5e82;
  display: flex;
  justify-content: space-between;
  user-select: none;
  position:relative;
}

.back-btn {
  background: linear-gradient(180deg, #a1b0d3 0%, #6b799d 100%);
  border: 1px solid #4a567a;
  border-radius: 6px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.6),
    0 2px 4px rgba(0,0,0,0.3);
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s;
}

.back-btn:hover {
  background: linear-gradient(180deg, #6b799d 0%, #a1b0d3 100%);
}

.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  z-index: 1;
  pointer-events: none; /* 让标题不阻挡按钮点击 */
}
/* 消息区域 */
.chat {
  background: e0e0e0;
  border-top: 2px solid #91a7d0;
  border-bottom: 2px solid #91a7d0;
  padding: 8px;
  font-size: 13px;
  line-height: 1.4em;
  font-family: 'Courier New', monospace;
  width: 95%;
  /* 居中 */
  margin: 0 auto;
  flex: 1;                   /* 占据剩余空间 */
  overflow-y: auto;          /* 可滚动 */
}


/* 输入区域 */
.input-area {
  width: 100%;
  background-color: #00000000;
  border:none;
  outline: none;
  font-size: 13px;
}

/* 输入框 */
.input-box {
  display: flex;
  flex-direction: column;
  border-top: 2px solid #7f8cb0;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #d0d8f3;
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 2px #7a89b9;
  flex-shrink: 0;            /* 固定高度 */ /* 扣除水平padding(12px*2) */
  margin: 0 12px 12px;       /* 底部外边距保证间距 */
  color: transparent;
  caret-color: #678adc;
  position: relative;
  z-index: 1;
}

/* 按钮 */
.button {
  background: #d0d8f3;
  border: 2px solid #576a9b;
  box-shadow: inset 1px 1px #fff;
  color: black;
  font-weight: bold;
  font-size: 13px;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.button:active {
  background: #8b99d7;
  box-shadow: inset 1px 1px #5364a0, inset -1px -1px #b1bcee;
}

/* 简单图标样式示例 - 字体或 SVG */
.icon {
  width: 20px; height: 20px;
  fill: #4a5e82;
  cursor: pointer;
  user-select: none;
}

.message-row {
  display: flex;
  align-items: flex-start;
  margin: 6px 0;
  max-width: 75%;
}

.user-row {
  flex-direction: row-reverse; /* 用户消息头像在右，消息气泡靠右 */
  margin-left: auto;           /* 右对齐 */
  text-align: right;
}

.ai-row {
  flex-direction: row;         /* AI消息头像在左，消息气泡靠左 */
  margin-right: auto;          /* 左对齐 */
  text-align: left;
}

.avatar {
  width: 32px;
  height: 32px;
  margin: 0 8px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius:0; /* 圆形头像 */
}

.bubble {
  background: #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  box-shadow:
    inset 2px 2px 5px #a0a0a0,
    inset -2px -2px 5px #fff;
  max-width: 100%;
  word-wrap: break-word;
}

/* 根据消息类型调整气泡颜色 */
.user-row .bubble {
  background: #d2e2ff;
  border-color: #a0b9ff;
}

.ai-row .bubble {
  background: #f0f0f0;
  border-color: #c0c0c0;
}

/* 当前正在输入的消息，突出显示 */

/* 右侧用户消息 */
.bubble.user {
 width: 200px;
  margin-left: auto;
  background: #d2e2ff;
  border-color: #a0b9ff;
  box-shadow:
    inset 2px 2px 5px #7a94d2,
    inset -2px -2px 5px #d9e9ff;
  color: #000;
}

/* 左侧AI消息 */
.bubble.ai {
  margin-right: auto;
  background: #f0f0f0;
  border-color: #c0c0c0;
  box-shadow:
    inset 2px 2px 5px #b6b6b6,
    inset -2px -2px 5px #ffffff;
  color: #222;
}
.bubble_current {
  max-width: 80%;
  font-family: 'Courier New', Courier, monospace;
  height:18px;
  font-size: 13px;
  color: #000;
  word-break: break-word;
  user-select: text;
  flex-shrink: 0;            /* 固定高度 */ /* 扣除水平padding(12px*2) */
  border:none;     /* 底部外边距保证间距 */
  position: relative;
  z-index: 100000;
  background-color: #00000000;
  white-space: nowrap;         /* 不换行 */
  overflow: hidden;            /* 超出隐藏 */
  text-overflow: ellipsis;
}
/* 星星容器 */
.stars {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* 一个简单星星点基础样式 */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  filter: drop-shadow(0 0 2px white);
  animation: twinkle 3s infinite alternate;
}

/* 让每个星星闪烁不同步 */
.star:nth-child(odd) {
  animation-duration: 4s;
  animation-delay: 0s;
}
.star:nth-child(even) {
  animation-duration: 2.5s;
  animation-delay: 1s;
}

/* 闪烁动画 */
@keyframes twinkle {
  from {
    opacity: 0.2;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>