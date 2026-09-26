import { useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GAME_META } from "../data";
import { shuffle } from "../random";
import type { Unit } from "../types";
import { GameShell } from "./GameShell";

interface ToneGameProps {
  unit: Unit;
  showPinyin: boolean;
  play: (src: string) => void;
  playSfx: (kind: "correct" | "wrong") => void;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

const TONE_PATHS = [
  "M 12 24 L 88 24",
  "M 12 76 Q 50 76 88 24",
  "M 12 28 Q 50 94 88 24",
  "M 12 24 Q 50 24 88 76",
];

function TonePath({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 100 100" className="tone-path" aria-hidden="true">
      <path d={TONE_PATHS[tone - 1]} />
    </svg>
  );
}

export function ToneGame({
  unit,
  showPinyin,
  play,
  playSfx,
  onBack,
  onComplete,
}: ToneGameProps) {
  const rounds = useMemo(() => shuffle(unit.toneRounds), [unit.id, unit.toneRounds]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [missedThisRound, setMissedThisRound] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const round = rounds[roundIndex];

  useEffect(() => {
    play(round.audio);
  }, [play, round.audio, roundIndex]);

  useEffect(
    () => () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    },
    [],
  );

  const scheduleAdvance = (nextScore: number) => {
    advanceTimerRef.current = window.setTimeout(() => {
      if (roundIndex === rounds.length - 1) {
        onComplete(nextScore, rounds.length * 2);
        return;
      }
      setRoundIndex((value) => value + 1);
      setSelected(null);
      setStatus("idle");
      setMissedThisRound(false);
    }, 900);
  };

  const choose = (tone: number) => {
    if (status === "correct") return;
    setSelected(tone);
    if (tone === round.tone) {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      const nextScore = score + (missedThisRound ? 1 : 2);
      setScore(nextScore);
      setStatus("correct");
      playSfx("correct");
      scheduleAdvance(nextScore);
      return;
    }
    setMissedThisRound(true);
    setStatus("wrong");
    playSfx("wrong");
    resetTimerRef.current = window.setTimeout(() => {
      setSelected(null);
      setStatus("idle");
    }, 650);
  };

  return (
    <GameShell
      unit={unit}
      title={GAME_META.tones.title}
      chinese={GAME_META.tones.chinese}
      instruction={`Listen for the shape of the sound in ${unit.chinese}.`}
      round={roundIndex}
      total={rounds.length}
      score={score}
      onBack={onBack}
      onReplay={() => play(round.audio)}
    >
      <div className="round-content" key={roundIndex}>
        <div className="tone-mystery">
          <span>Can you hear the shape?</span>
          <strong>{status === "correct" ? round.pinyin : "??? "}</strong>
          <small>
            {status === "correct"
              ? `${round.hanzi}${showPinyin ? ` · ${round.pinyin}` : ""} · ${round.label}`
              : "1 · 2 · 3 · 4"}
          </small>
        </div>

        <div className="tone-grid">
          {[1, 2, 3, 4].map((tone) => {
            const isSelected = selected === tone;
            return (
              <button
                key={tone}
                className={[
                  "tone-card",
                  `tone-card--${tone}`,
                  isSelected && status === "correct" ? "is-correct" : "",
                  isSelected && status === "wrong" ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => choose(tone)}
                aria-label={`Tone ${tone}`}
              >
                <span className="tone-card__number">{tone}</span>
                <TonePath tone={tone} />
                <span>{["high", "rising", "dip", "falling"][tone - 1]}</span>
              </button>
            );
          })}
        </div>

        <div className="feedback-row" aria-live="polite">
          {status === "wrong" && (
            <p className="feedback feedback--wrong">
              <RotateCcw size={18} /> Listen to the ending of the sound.
            </p>
          )}
          {status === "correct" && (
            <p className="feedback feedback--correct">
              <Check size={18} /> Tone {round.tone}: {round.label.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </GameShell>
  );
}
