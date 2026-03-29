// Web Speech API - free, browser-native text-to-speech

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find(
    (v) => v.lang.startsWith("ja") && v.localService
  ) || voices.find((v) => v.lang.startsWith("ja"));

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  if (onEnd) utterance.onend = onEnd;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stop() {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  return window.speechSynthesis.speaking;
}
