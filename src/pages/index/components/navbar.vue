<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const menuButtonSupport = {
  'ios': false,
  'android': false,
  'mp-weixin': true,
}

const appStore = useAppStore()
const hasMenuButton = computed(() => {
  const systemInfo = uni.getSystemInfoSync()
  return menuButtonSupport[systemInfo.platform]
})

function showDrawer() {
  appStore.showDrawer = true
}

function goToBind() {
  uni.navigateTo({
    url: '/pages/bind/index',
  })
}
</script>

<template>
  <view class="navbar-container">
    <view class="navbar-tools">
      <up-icon name="list" size="24" @click="showDrawer" />
      <up-icon v-if="hasMenuButton" name="plus" size="18" />
    </view>
    <view class="navbar-title">
      康护e家
    </view>
    <view class="navbar-tools flex-row-reverse">
      <up-icon v-if="!hasMenuButton" name="plus" size="18" @click="goToBind" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.navbar-container {
  height: 50px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;

  .navbar-tools {
    width: 64px;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    gap: 8px;
  }

  .navbar-title {
    width: calc(100% - 128px);
    display: flex;
    justify-content: center;
  }
}
</style>
