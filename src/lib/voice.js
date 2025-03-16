export class VoiceInput {
  constructor() {
    this.recognition = null
    this.isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    
    if (this.isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
    }
  }

  startListening(onResult, onError) {
    if (!this.isSupported) {
      onError(new Error('Speech recognition is not supported in this browser'))
      return
    }

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1
      const text = event.results[last][0].transcript
      onResult(text)
    }

    this.recognition.onerror = (event) => {
      onError(event.error)
    }

    this.recognition.start()
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  isListening() {
    return this.recognition?.state === 'listening'
  }
} 