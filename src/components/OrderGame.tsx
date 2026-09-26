import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, Lightbulb, RotateCcw } from "lucide-react";
import { GAME_META } from "../data";
import { shuffle } from "../random";
import type { Unit } from "../types";
import { GameShell } from "./GameShell";

interface OrderGameProps {
  unit: Unit;
  showPinyin: boolean;
  play: (src: string) => void;
  playSfx: (kind: "correct" | "wrong") => void;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export function OrderGame({
  unit,
  showPinyin,
  play,
  playSfx,
  onBack,
  onComplete,
}: OrderGameProps) {
  const rounds = unit.orderRounds;
  const [roundIndex, setRoundIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHelp, setShowHelp] = useState(true);
  const [missedThisRound, setMissedThisRound] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const round = rounds[roundIndex];
  const tokens = useMemo(() => shuffle(round.tokens), [round]);

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
      setPlaced([]);
      setStatus("idle");
      setShowHelp(true);
      setMissedThisRound(false);
    }, 900);
  };

  const chooseToken = (id: string) => {
    if (status !== "idle" || placed.includes(id)) return;
    const next = [...placed, id];
    setPlaced(next);

    if (next.length !== round.answer.length) return;

    if (next.every((token, index) => token === round.answer[index])) {
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
      setPlaced([]);
      setStatus("idle");
    }, 800);
  };

  const reset = () => {
    setPlaced([]);
    setStatus("idle");
  };

  return (
    <GameShell
      unit={unit}
      title={GAME_META.order.title}
      chinese={GAME_META.order.chinese}
      instruction={GAME_META.order.instruction}
      round={roundIndex}
      total={rounds.length}
      score={score}
      onBack={onBack}
      onReplay={() => play(round.audio)}
    >
      <div className="round-content" key={roundIndex}>
        <div className="order-stage">
          <div className="order-help">
            <button className="hint-button" onClick={() => setShowHelp((value) => !value)}>
              <Lightbulb size={17} />
              English hint
            </button>
            <span>{showHelp ? round.english : "Hint hidden"}</span>
          </div>

          <div
            className="sentence-slots"
            aria-label="Sentence being built"
            style={{ "--slot-count": round.answer.length } as CSSProperties}
          >
            {round.answer.map((_, index) => {
              const token = round.tokens.find((item) => item.id === placed[index]);
              return (
                <span
                  className={[
                    "sentence-slot",
                    token ? "is-filled" : "",
                    status === "wrong" ? "is-wrong" : "",
                    status === "correct" ? "is-correct" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={index}
                >
                  {token ? (
                    <>
                      <strong>{token.hanzi}</strong>
                      {showPinyin && <small>{token.pinyin}</small>}
                    </>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className="token-bank">
          {tokens.map((token) => {
            const isUsed = placed.includes(token.id);
            return (
              <button
                key={token.id}
                className={isUsed ? "token-tile is-used" : "token-tile"}
                onClick={() => chooseToken(token.id)}
                disabled={isUsed}
              >
                <strong>{token.hanzi}</strong>
                {showPinyin && <small>{token.pinyin}</small>}
              </button>
            );
          })}
        </div>

        <div className="feedback-row" aria-live="polite">
          {status === "wrong" && (
            <p className="feedback feedback--wrong">
              <RotateCcw size={18} /> That order does not sound right yet.
            </p>
          )}
          {status === "correct" && (
            <p className="feedback feedback--correct">
              <Check size={18} /> The bridge is ready.
            </p>
          )}
          {status === "idle" && placed.length > 0 && (
            <button className="quiet-button" onClick={reset}>
              <RotateCcw size={17} /> Reset sentence
            </button>
          )}
        </div>
      </div>
    </GameShell>
  );
}
