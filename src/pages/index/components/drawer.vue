<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>

<template>
  <up-popup v-model:show="appStore.showDrawer" mode="left">
    <view class="drawer-container">
      <text>人生若只如初见，何事秋风悲画扇</text>
    </view>
  </up-popup>
</template>

<style lang="scss" scoped>
.drawer-container {
  padding: 96rpx 40rpx 0 40rpx;
}
</style>
