import { Home, RotateCcw, Star } from "lucide-react";

interface FinishPanelProps {
  score: number;
  total: number;
  title: string;
  onReplay: () => void;
  onHome: () => void;
}

export function FinishPanel({ score, total, title, onReplay, onHome }: FinishPanelProps) {
  const stars = score >= total * 0.9 ? 3 : score >= total * 0.65 ? 2 : 1;

  return (
    <div className="finish-panel">
      <div className="finish-panel__lantern">灯</div>
      <p className="section-kicker">The lantern is glowing</p>
      <h2>{title} complete</h2>
      <div className="finish-stars" aria-label={`${stars} stars earned`}>
        {[0, 1, 2].map((index) => (
          <Star key={index} size={34} fill={index < stars ? "currentColor" : "none"} />
        ))}
      </div>
      <p>
        You earned <strong>{score}</strong> of {total} possible points.
      </p>
      <div className="finish-actions">
        <button className="primary-button" onClick={onReplay}>
          <RotateCcw size={18} /> Play again
        </button>
        <button className="quiet-button" onClick={onHome}>
          <Home size={18} /> Town map
        </button>
      </div>
    </div>
  );
}

