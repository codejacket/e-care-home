import { defineStore } from 'pinia'
import chatApi from '@/api/chat'
import { parseTime } from '@/utils/index'

export interface Session {
  sessionId: string
  sessionTitle: string
  lastTime: number
  isTop: boolean
}

const pinText = '置顶'

export const useChatStore = defineStore('chat', () => {
  const sessionList = ref<Session[]>([])

  const sessionListByLabel = computed(() => {
    return sessionList.value.sort((a, b) => a.lastTime - b.lastTime).reduce((acc, ses) => {
      const label = getSessionLabel(ses)
      if (acc[label]) {
        acc[label].push(ses)
      } else {
        acc[label] = [ses]
      }
      return acc
    }, {
      [pinText]: [],
    } as Record<string, Session[]>)
  })

  async function getSessionList() {
    const { data } = await chatApi.getSessionList()
    sessionList.value = data
  }

  async function delSession(sessionIds: string[]) {
    await chatApi.delSession(sessionIds)
    await chatApi.getSessionList()
  }

  async function updateSession({ sessionId, sessionTitle, isTop }) {
    await chatApi.updateSession({ sessionId, sessionTitle, isTop })
    await chatApi.getSessionList()
  }

  return {
    sessionList,
    sessionListByLabel,
    getSessionList,
    updateSession,
    delSession,
  }
})

function getSessionLabel(session: Session) {
  if (session.isTop) {
    return pinText
  } else {
    return parseTime(session.lastTime, '{y}年{m}月')
  }
}
