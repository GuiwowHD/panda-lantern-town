import { useCallback, useRef } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback((src: string) => {
    audioRef.current?.pause();
    const audio = new Audio(src);
    audioRef.current = audio;
    void audio.play().catch(() => undefined);
  }, []);

  const playSfx = useCallback((kind: "correct" | "wrong") => {
    const AudioContextClass = window.AudioContext;
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;

    if (context.state === "suspended") {
      void context.resume();
    }

    const now = context.currentTime;
    const tone = (frequency: number, start: number, duration: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.14, now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + start);
      oscillator.stop(now + start + duration + 0.02);
    };

    if (kind === "correct") {
      tone(523.25, 0, 0.16);
      tone(659.25, 0.08, 0.18);
      tone(783.99, 0.16, 0.24);
      return;
    }

    tone(220, 0, 0.18);
    tone(174.61, 0.1, 0.22);
  }, []);

  return { play, playSfx };
}

