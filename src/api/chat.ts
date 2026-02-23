export default {
  async uploadChatFile(filePath: string) {
    return {
      data: {
        url: filePath,
        id: '1',
      },
    }
  },
  async getSessionList() {
    return {
      data: [{
        sessionId: '1',
        sessionTitle: '测试会话1',
        lastTime: 1771434059525,
        isTop: false,
      }, {
        sessionId: '2',
        sessionTitle: '测试会话2',
        lastTime: 1771434059525,
        isTop: true,
      }, {
        sessionId: '3',
        sessionTitle: '测试会话3',
        lastTime: 1771434059525,
        isTop: false,
      }, {
        sessionId: '4',
        sessionTitle: '测试会话4',
        lastTime: 1771434059525,
        isTop: false,
      }, {
        sessionId: '5',
        sessionTitle: '测试会话5',
        lastTime: 1771434059525,
        isTop: true,
      }],
    }
  },
  async updateSession({ sessionId, sessionTitle, isTop }) {
    return {}
  },
  async delSession(sessionIds: string[]) {
    return {}
  },
}
