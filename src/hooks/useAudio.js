/**
 * useAudio - Lightweight SFX engine using Web Audio API.
 * Generates tones and effects procedurally (no external audio files needed).
 */

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency, duration, type = "sine", volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio is blocked
  }
}

export function playChime() {
  playTone(880, 0.15, "sine", 0.2);
  setTimeout(() => playTone(1100, 0.15, "sine", 0.15), 100);
  setTimeout(() => playTone(1320, 0.2, "sine", 0.2), 200);
}

export function playPop() {
  playTone(600, 0.08, "sine", 0.3);
  setTimeout(() => playTone(900, 0.06, "sine", 0.2), 50);
}

export function playMagicOpen() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => playTone(400 + i * 150, 0.12, "sine", 0.15), i * 80);
  }
}

export function playSuccess() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.3, "sine", 0.2), i * 150);
  });
}

export function playRevealFanfare() {
  const notes = [392, 523, 659, 784, 1047, 1319]; // G4 to E6
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.4, "triangle", 0.25), i * 120);
  });
}

export function playCheering() {
  // Simulated cheering with layered noise bursts
  for (let i = 0; i < 8; i++) {
    const freq = 200 + Math.random() * 600;
    setTimeout(() => playTone(freq, 0.15, "sawtooth", 0.05), i * 100);
  }
}

export function playTickTock() {
  playTone(1000, 0.05, "square", 0.1);
}

export function playUrgentTick() {
  playTone(1200, 0.05, "square", 0.15);
  setTimeout(() => playTone(800, 0.05, "square", 0.1), 60);
}

export function playStarEarned() {
  playTone(1047, 0.2, "sine", 0.2);
  setTimeout(() => playTone(1319, 0.3, "sine", 0.25), 150);
}

export function playClick() {
  playTone(700, 0.04, "sine", 0.15);
}

// Resume audio context on user gesture (required by browsers)
export function resumeAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  } catch (e) {}
}
