import type { ReactNode } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import type { Unit } from "../types";

interface GameShellProps {
  unit: Unit;
  title: string;
  chinese: string;
  instruction: string;
  round: number;
  total: number;
  score: number;
  onBack: () => void;
  onReplay: () => void;
  children: ReactNode;
}

export function GameShell({
  unit,
  title,
  chinese,
  instruction,
  round,
  total,
  score,
  onBack,
  onReplay,
  children,
}: GameShellProps) {
  return (
    <div className="game-screen">
      <header className="game-header">
        <button className="icon-button" onClick={onBack} aria-label="Back home" title="Back home">
          <ArrowLeft size={22} />
        </button>
        <div className="game-heading">
          <span className="game-heading__eyebrow">
            World {unit.number} · Challenge {round + 1} of {total}
          </span>
          <h1>
            {title} <span>{chinese}</span>
          </h1>
        </div>
        <div className="game-score" aria-label={`${score} points`}>
          <strong>{score}</strong>
          <span>points</span>
        </div>
      </header>

      <main className="game-main">
        <div className="instruction-row">
          <p>{instruction}</p>
          <button
            className="listen-button"
            onClick={onReplay}
            aria-label="Play Chinese audio again"
            title="Play audio again"
          >
            <Volume2 size={20} />
            Play sound
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
