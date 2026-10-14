import type {
  Pronunciation,
  PronunciationPlayer,
} from '../domain/notebook-types'

export class BrowserPronunciationPlayer implements PronunciationPlayer {
  play(term: string, pronunciation?: Pronunciation): boolean {
    if (pronunciation?.audioUrl) {
      const audio = new Audio(pronunciation.audioUrl)
      void audio.play().catch(() => undefined)
      return true
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false
    }

    const utterance = new SpeechSynthesisUtterance(term)
    utterance.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return true
  }
}
