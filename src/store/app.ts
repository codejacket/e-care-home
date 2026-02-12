import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const showDrawer = ref(false)

  return {
    showDrawer,
  }
})
