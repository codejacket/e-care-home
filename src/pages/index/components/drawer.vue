<script lang="ts" setup>
import type { Session } from '@/store/chat'
import { onClickOutside, useToggle } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { useChatStore } from '@/store/chat'

const appStore = useAppStore()
const chatStore = useChatStore()
const [selecting, toggleSelecting] = useToggle()
const selectSessionIds = ref<string[]>([])
// 当前长按的会话数据
const currentSession = ref(null)
// 菜单弹出的位置
const menuPosition = ref({ top: 0, left: 0 })
const showContextMenu = ref(false)
const showDelModal = ref(false)
const showRenameModal = ref(false)
const renameSessionObj = ref({
  sessionId: '',
  sessionTitle: '',
})
const contextMenu = ref(null)

const allSessionIds = computed(() => chatStore.sessionList.map(session => session.sessionId))

function handleLongPress(session: Session, event: any) {
  if (!selecting.value) {
    // 获取触摸点的页面坐标
    const { pageX, pageY } = event.touches[0]
    currentSession.value = session
    menuPosition.value = { top: pageY, left: pageX }
    showContextMenu.value = true
  }
}

async function delSession() {
  try {
    await chatStore.delSession(selectSessionIds.value)
    uni.showToast({
      title: '对话已删除',
      icon: 'none',
    })
    selectSessionIds.value = []
    selecting.value = false
    currentSession.value = null
  } catch (error) {
    console.error(error)
  }
}

async function renameSession() {
  try {
    await chatStore.updateSession({
      ...currentSession.value,
      sessionTitle: renameSessionObj.value.sessionTitle,
    })
    currentSession.value = null
  } catch (error) {
    console.error(error)
  }
}

function handleMenuClick(menu: 'rename' | 'pin' | 'delete') {
  switch (menu) {
    case 'rename':
      renameSessionObj.value = {
        sessionId: currentSession.value.sessionId,
        sessionTitle: currentSession.value.sessionTitle,
      }
      showRenameModal.value = true
      break
    case 'pin':
      chatStore.updateSession({
        ...currentSession.value,
        isTop: !currentSession.value.isTop,
      })
      currentSession.value = null
      break
    case 'delete':
      selectSessionIds.value = [currentSession.value.sessionId]
      showDelModal.value = true
      break
  }
  showContextMenu.value = false
}

function toggleAll() {
  if (selectSessionIds.value.length === allSessionIds.value.length) {
    selectSessionIds.value = []
  } else {
    selectSessionIds.value = [...allSessionIds.value]
  }
}

function closeMenu() {
  currentSession.value = null
  showContextMenu.value = false
}

watch(selecting, (val) => {
  if (!val) {
    selectSessionIds.value = []
  }
})

chatStore.getSessionList()
onClickOutside(contextMenu, closeMenu)
</script>

<template>
  <up-popup v-model:show="appStore.showDrawer" mode="left">
    <view class="drawer-container">
      <view class="drawer-header" />
      <view class="flex justify-between">
        <text class="text-gray-800 font-bold">历史对话</text>
        <text class="text-sm text-blue-500" @click="toggleSelecting()">{{ selecting ? '取消' : '管理' }}</text>
      </view>
      <up-checkbox-group v-model="selectSessionIds">
        <scroll-view class="drawer-scroll">
          <view v-for="sessions, key in chatStore.sessionListByLabel" :key="key">
            <view class="my-8px text-12px color-#9ca3af">
              {{ key }}
            </view>
            <view class="flex flex-col gap-8px">
              <view v-for="session in sessions" :key="session.sessionId"
                class="flex items-center gap-3px bg-gray-50 p-10px text-14px color-#374151"
                :class="{ 'is-longpress': currentSession?.sessionId === session.sessionId }"
                @longpress="handleLongPress(session, $event)">
                <up-checkbox v-if="selecting" :name="session.sessionId" shape="circle" size="14" />
                {{ session.sessionTitle }}
              </view>
            </view>
          </view>
        </scroll-view>
      </up-checkbox-group>
      <view v-if="selecting" class="flex items-center justify-between pt-10px">
        <view class="flex items-center gap-8px">
          <up-checkbox used-alone
            :checked="selectSessionIds.length === allSessionIds.length && allSessionIds.length > 0" shape="circle"
            size="14" label="全选" @change="toggleAll" />
        </view>
        <text class="color-red" @click="showDelModal = true">删除({{ selectSessionIds.length }})</text>
      </view>
    </view>
    <up-modal v-model:show="showDelModal" show-cancel-button title="确认删除"
      :content="`确认删除选中的${selectSessionIds.length}条对话吗？`" content-text-align="center" @confirm="delSession" />
    <up-modal v-model:show="showRenameModal" title="重命名对话框" show-cancel-button content-text-align="center"
      @confirm="renameSession">
      <up-input v-model="renameSessionObj.sessionTitle" />
    </up-modal>
    <view v-if="showContextMenu" ref="contextMenu" class="context-menu"
      :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }" @click.stop>
      <view class="context-menu-item" @touchend="handleMenuClick('rename')">
        <up-icon name="edit-pen" size="18" />
        <text class="context-menu-text">重命名</text>
      </view>
      <view class="context-menu-item" @touchend="handleMenuClick('pin')">
        <up-icon name="pushpin" size="18" />
        <text class="context-menu-text">{{ currentSession.isTop ? '取消置顶' : '置顶' }}</text>
      </view>
      <view class="context-menu-item" @touchend="handleMenuClick('delete')">
        <up-icon name="trash" size="18" />
        <text class="context-menu-text">删除</text>
      </view>
    </view>
  </up-popup>
</template>

<style lang="scss" scoped>
.drawer-container {
  width: 480rpx;
  padding: 96rpx 40rpx 0 40rpx;

  .drawer-scroll {
    mask: linear-gradient(180deg, #000 0, #000 90%, transparent);

    .is-longpress {
      background-color: #f0f2f5;
    }
  }
}

.context-menu {
  position: absolute;
  width: 120px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;

  .context-menu-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px;
  }
}
</style>
