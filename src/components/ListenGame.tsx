import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GAME_META, WORDS, getListenRounds } from "../data";
import type { Unit, WordId } from "../types";
import { GameShell } from "./GameShell";

interface ListenGameProps {
  unit: Unit;
  showPinyin: boolean;
  play: (src: string) => void;
  playSfx: (kind: "correct" | "wrong") => void;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function ListenGame({
  unit,
  showPinyin,
  play,
  playSfx,
  onBack,
  onComplete,
}: ListenGameProps) {
  const rounds = getListenRounds(unit);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<WordId | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [missedThisRound, setMissedThisRound] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const round = rounds[roundIndex];
  const target = WORDS[round.target];

  useEffect(() => {
    play(target.audio);
  }, [play, roundIndex, target.audio]);

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
      setSelected(null);
      setStatus("idle");
      setMissedThisRound(false);
      setRoundIndex((value) => value + 1);
    }, 900);
  };

  const choose = (id: WordId) => {
    if (status === "correct") return;
    setSelected(id);

    if (id === round.target) {
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
      title={GAME_META.listen.title}
      chinese={GAME_META.listen.chinese}
      instruction={GAME_META.listen.instruction}
      round={roundIndex}
      total={rounds.length}
      score={score}
      onBack={onBack}
      onReplay={() => play(target.audio)}
    >
      <div className="round-content" key={roundIndex}>
        <div className="prompt-stage">
          <div className="speaker-disc">
            <span>中文 · {unit.chinese}</span>
            <strong>{status === "correct" ? target.hanzi : "?"}</strong>
            <small>
              {status === "correct" && showPinyin ? target.pinyin : "listen closely"}
            </small>
          </div>
        </div>

        <div className="picture-grid">
          {round.options.map((id) => {
            const word = WORDS[id];
            const isSelected = selected === id;
            return (
              <button
                key={id}
                className={[
                  "picture-card",
                  isSelected && status === "correct" ? "is-correct" : "",
                  isSelected && status === "wrong" ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => choose(id)}
                aria-label={`Choose ${word.english}`}
              >
                <span
                  className="picture-card__image-wrap"
                  style={{ "--card-color": word.color } as CSSProperties}
                >
                  <img src={word.image} alt="" />
                </span>
                <span className="picture-card__mystery">{isSelected ? "•" : "?"}</span>
              </button>
            );
          })}
        </div>

        <div className="feedback-row" aria-live="polite">
          {status === "wrong" && (
            <p className="feedback feedback--wrong">
              <RotateCcw size={18} /> Not quite. Try again.
            </p>
          )}
          {status === "correct" && (
            <p className="feedback feedback--correct">
              <Check size={18} /> You found {target.hanzi}
              {showPinyin ? `, ${target.pinyin}` : ""}.
            </p>
          )}
        </div>
      </div>
    </GameShell>
  );
}
