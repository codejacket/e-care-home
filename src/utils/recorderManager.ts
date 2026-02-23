interface RecorderManager {
  start: (options: any) => void
  stop: () => void
  onStop: (callback: (res: any) => void) => void
}

function createRecorderManager(): RecorderManager {
  // #ifdef MP || APP
  return uni.getRecorderManager()
  // #endif

  // #ifdef H5
  let mediaRecorder: MediaRecorder | null = null
  let audioChunks: Blob[] = []
  const callbacks: ((res: any) => void)[] = []

  return {
    start: (options: any) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
          const tempFilePath = URL.createObjectURL(audioBlob)
          callbacks.forEach(cb => cb({ tempFilePath }))
        }

        mediaRecorder.start()
      })
    },
    stop: () => {
      mediaRecorder?.stop()
      mediaRecorder?.stream.getTracks().forEach(track => track.stop())
    },
    onStop: (callback: (res: any) => void) => {
      callbacks.push(callback)
    },
  }
  // #endif
}

export { createRecorderManager }
