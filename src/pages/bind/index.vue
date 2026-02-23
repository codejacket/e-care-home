<script lang="ts" setup>
import Scanning from './components/scanning.vue'
</script>

<template>
  <view class="bind-page page">
    <navbar title="绑定戒指" />
    <view class="mb-16 rounded-2xl bg-gray-50 p-5">
      <view class="mb-3 text-sm text-gray-600 font-bold">
        温馨提示：
      </view>
      <view class="text-xs text-gray-500 leading-relaxed space-y-3">
        <view class="flex gap-2">
          <text>1、</text>
          第一次绑定时，戒指需要充电唤醒。
        </view>
        <view class="flex gap-2">
          <text>2、</text>
          如果发现绑定不上，请尝试在充电状态下再次扫描。
        </view>
        <view class="flex gap-2">
          <text>3、</text>
          不要在手机系统设置里连接蓝牙设备，如果已经连接，请断开后再通过本APP扫描。
        </view>
      </view>
    </view>
    <Scanning />
    <up-button class="mt-auto" type="primary" :plain="true" text="停止扫描" />
  </view>
</template>

<style lang="scss" scoped>
.bind-page {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}
</style>
