/**
 * Procedural sound effects using Web Audio API.
 * Zero audio files needed — all sounds are synthesized at runtime.
 */

type AudioCtx = AudioContext & { state: string };

let ctx: AudioCtx | null = null;

function getCtx(): AudioCtx | null {
  if (typeof window === "undefined") return null;
  if (!ctx || ctx.state === "closed") {
    ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )() as AudioCtx;
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function ramp(gain: GainNode, vol: number, start: number, end: number, c: AudioContext) {
  gain.gain.setValueAtTime(vol, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + end);
}

// ✅ Correct answer — ascending chime
export function playCorrect() {
  const c = getCtx();
  if (!c) return;
  [523, 659, 784].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0, c.currentTime + i * 0.12);
    ramp(gain, 0.4, i * 0.12, i * 0.12 + 0.35, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + i * 0.12);
    osc.stop(c.currentTime + i * 0.12 + 0.4);
  });
}

// ❌ Wrong answer — descending buzz
export function playWrong() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, c.currentTime + 0.3);
  ramp(gain, 0.3, 0, 0.35, c);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.4);
}

// 🪙 Coin pickup — bright ping
export function playCoin() {
  const c = getCtx();
  if (!c) return;
  [1047, 1319].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.08);
    ramp(gain, 0.35, i * 0.08, i * 0.08 + 0.25, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + i * 0.08);
    osc.stop(c.currentTime + i * 0.08 + 0.3);
  });
}

// ⭐ Level up — triumphant fanfare
export function playLevelUp() {
  const c = getCtx();
  if (!c) return;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.15);
    ramp(gain, 0.25, i * 0.15, i * 0.15 + 0.3, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + i * 0.15);
    osc.stop(c.currentTime + i * 0.15 + 0.35);
  });
}

// 📄 Page turn — soft whoosh
export function playPageTurn() {
  const c = getCtx();
  if (!c) return;
  const bufSize = c.sampleRate * 0.15;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  }
  const src = c.createBufferSource();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(2000, c.currentTime);
  src.buffer = buf;
  gain.gain.setValueAtTime(0.15, c.currentTime);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start();
}

// ⚔️ Boss hit — impact thud
export function playBossHit() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.2);
  ramp(gain, 0.7, 0, 0.25, c);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.3);
}

// 🏆 Victory — happy jingle
export function playVictory() {
  const c = getCtx();
  if (!c) return;
  const melody = [523, 523, 659, 523, 784, 740];
  const times = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
  melody.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, c.currentTime + times[i]);
    ramp(gain, 0.4, times[i], times[i] + 0.3, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + times[i]);
    osc.stop(c.currentTime + times[i] + 0.35);
  });
}

// 💔 Player damage — alarm
export function playPlayerHit() {
  const c = getCtx();
  if (!c) return;
  [440, 330].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.15);
    ramp(gain, 0.3, i * 0.15, i * 0.15 + 0.2, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + i * 0.15);
    osc.stop(c.currentTime + i * 0.15 + 0.25);
  });
}

// 🐾 Pet happy — soft ding
export function playPetHappy() {
  const c = getCtx();
  if (!c) return;
  [880, 1100, 1320].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, c.currentTime + i * 0.1);
    ramp(gain, 0.2, i * 0.1, i * 0.1 + 0.3, c);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + i * 0.1);
    osc.stop(c.currentTime + i * 0.1 + 0.35);
  });
}

// ⏰ Timer tick
export function playTick() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1200, c.currentTime);
  ramp(gain, 0.1, 0, 0.05, c);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.06);
}
