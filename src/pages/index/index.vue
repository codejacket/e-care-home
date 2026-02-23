<script lang="ts" setup>
import ChatEditor from './components/chatEditor.vue'
import Drawer from './components/drawer.vue'
import Navbar from './components/navbar.vue'

defineOptions({ name: 'Home' })
definePage({
  type: 'home',
  style: {
    // 自定义导航栏
    navigationStyle: 'custom',
    // 禁用下拉刷新，避免与聊天滚动冲突
    enablePullDownRefresh: false,
    backgroundColor: '#F8F8F8',
    // 禁止页面滚动
    disableScroll: false,
  },
})
</script>

<template>
  <view class="index-page page">
    <Navbar />
    <Drawer />
    <ChatEditor />
  </view>
</template>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
}
</style>
