<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import chatApi from '@/api/chat'
import { createRecorderManager } from '@/utils/recorderManager'

const emit = defineEmits(['send'])

const modelValue = defineModel({
  type: String,
  default: '',
})

const fileList = defineModel('fileList', {
  type: Array,
  default: () => [],
})

const lineCount = ref(1)
const [showMoreTools, toggleShowMoreTools] = useToggle()
const [isVoiceMode, toggleVoiceMode] = useToggle()
const [isFullscreen, toggleFullscreen] = useToggle()
const showMask = ref(false)
const needCancel = ref(false)
const recorderManager = createRecorderManager()

const voiceStyle = computed(() => {
  if (needCancel.value) {
    return {
      text: '松开取消',
      background: 'red',
      color: 'red',
    }
  } else {
    return {
      text: '松开发送，上移取消',
      background: 'blue',
      color: '#666',
    }
  }
})

function handleLineChange(e: any) {
  lineCount.value = e.detail.lineCount
}

function handleTouchstart(e: any) {
  needCancel.value = false
  showMask.value = true
  recorderManager.start({})
}

function handleTouchend() {
  showMask.value = false
  recorderManager.stop()
}

function handleTouchmove(e: any) {
  needCancel.value = e.touches[0].pageY < 760
}

async function handleAfterRead(e: any) {
  const lists = [].concat(e.file)
  const startIndex = fileList.value.length
  fileList.value = [
    ...fileList.value,
    ...lists.map(file => ({
      ...file,
      status: 'uploading',
      message: '上传中',
    })),
  ]
  for (let i = 0; i < lists.length; i++) {
    try {
      const { data } = await chatApi.uploadChatFile(lists[i].url)
      fileList.value = fileList.value.map((item, index) =>
        index === startIndex + i
          ? { ...item, status: 'success', message: '', url: data?.url || lists[i].url, id: data?.id }
          : item,
      )
    } catch {
      fileList.value = fileList.value.map((item, index) =>
        index === startIndex + i
          ? { ...item, status: 'failed', message: '上传失败' }
          : item,
      )
    }
  }
}

function handleDelete(e: any) {
  fileList.value = fileList.value.filter((_, index) => index !== e.index)
}

function handleSend() {
  emit('send', {
    content: modelValue.value,
    fileList: fileList.value,
  })
}
</script>

<template>
  <view class="chat-editor">
    <scroll-view v-if="fileList.length" scroll-x :show-scrollbar="false">
      <up-upload v-model:file-list="fileList" upload-icon="plus" name="1" multiple :max-count="10"
        @after-read="handleAfterRead" @delete="handleDelete" />
    </scroll-view>
    <view class="h-full flex items-end">
      <up-icon v-if="modelValue === ''" class="p-6px" size="24" :name="isVoiceMode ? 'more-circle' : 'play-circle'"
        @click="toggleVoiceMode()" />
      <view v-if="isVoiceMode" class="chat-editor-voice-label" @touchstart="handleTouchstart" @touchend="handleTouchend"
        @touchcanel="handleTouchend" @touchmove="handleTouchmove">
        按住 说话
      </view>
      <textarea v-if="!isVoiceMode" v-model="modelValue" :maxlength="-1" class="chat-editor-textarea" auto-height
        placeholder="发消息或按住说话..." @linechange="handleLineChange" /> <!-- cspell:disable-line -->
      <up-icon class="p-6px" name="plus-circle" :style="{ transform: showMoreTools ? 'rotate(45deg)' : '' }" size="24"
        @click="toggleShowMoreTools()" />
      <view class="h-full flex flex-col-reverse justify-between">
        <up-icon v-if="modelValue" class="p-6px" color="blue" name="checkmark-circle-fill" size="24"
          @click="handleSend" />
        <up-icon v-if="lineCount > 2" class="mb-auto p-6px" name="scan" size="24" @click="toggleFullscreen()" />
      </view>
      <view v-if="showMask" class="voice-mask" :style="{ background: voiceStyle.background }">
        <view class="voice-mask-tip" :style="{ color: voiceStyle.color }">
          {{ voiceStyle.text }}
        </view>
        """"""""""""
      </view>
    </view>
  </view>
  <transition>
    <view v-if="showMoreTools" class="more-tools-container">
      <up-grid col="4">
        <up-grid-item>
          <up-icon name="photo-fill" size="32" />
          <text>相册</text>
        </up-grid-item>
        <up-grid-item>
          <up-icon name="camera-fill" size="32" />
          <text>拍照</text>
        </up-grid-item>
        <up-grid-item>
          <up-icon name="file-text-fill" size="32" />
          <text>文件</text>
        </up-grid-item>
        <up-grid-item>
          <up-icon name="phone-fill" size="32" />
          <text>电话</text>
        </up-grid-item>
      </up-grid>
    </view>
  </transition>
</template>

<style lang="scss" scoped>
.chat-editor {
  padding: 8px;
  border-top: 1px solid #e5e5e5;
  position: relative;

  .chat-editor-voice-label {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-editor-textarea {
    padding: 6px;
    width: 100%;
    border-radius: 2px;
    max-height: 300px;
    overflow: hidden;
  }

  .voice-mask {
    position: absolute;
    inset: 6px;
    border-radius: 3px;
    z-index: 1;
    text-align: center;
    font-size: 24px;
    letter-spacing: 1px;
    color: white;
    line-height: 55px;

    .voice-mask-tip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      color: #666;
      transform: translate(-50%, 0px);
      font-size: 12px;
    }
  }
}

.more-tools-container {
  height: 90px;
  display: flex;
  padding: 0 16px;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid #e5e5e5;
}
</style>
