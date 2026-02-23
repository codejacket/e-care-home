<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})

function handleBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="mb-8 flex items-center gap-4">
    <view class="p-2 -ml-2" @click="handleBack">
      <up-icon size="20" name="arrow-left" />
    </view>
    <view class="text-xl text-gray-800 font-bold">
      {{ title }}
    </view>
  </view>
</template>
