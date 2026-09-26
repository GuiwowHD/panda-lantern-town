import {
  ArrowLeft,
  AudioLines,
  BookOpen,
  Check,
  Headphones,
  Star,
  UserRound,
} from "lucide-react";
import type { CSSProperties } from "react";
import { GAME_META, WORDS } from "../data";
import { GAME_IDS, getUnitStars } from "../progress";
import type { GameId, GameProgress, Unit } from "../types";

interface UnitScreenProps {
  unit: Unit;
  progress: GameProgress;
  showPinyin: boolean;
  onBack: () => void;
  onOpenGrownUps: () => void;
  onStartGame: (gameId: GameId) => void;
}

const GAME_ICONS = {
  listen: Headphones,
  tones: AudioLines,
  order: BookOpen,
};

export function UnitScreen({
  unit,
  progress,
  showPinyin,
  onBack,
  onOpenGrownUps,
  onStartGame,
}: UnitScreenProps) {
  const unitStars = getUnitStars(progress[unit.id]);
  const allComplete = GAME_IDS.every((gameId) => progress[unit.id][gameId] > 0);

  return (
    <div className="unit-screen" style={{ "--unit-color": unit.color, "--unit-surface": unit.surface } as CSSProperties}>
      <header className="unit-header">
        <button className="icon-button" onClick={onBack} aria-label="Back to town" title="Back to town">
          <ArrowLeft size={22} />
        </button>
        <div>
          <span>World {unit.number}</span>
          <strong>
            {unit.title} · {unit.chinese}
          </strong>
        </div>
        <button
          className="topbar-button unit-header__grownups"
          onClick={onOpenGrownUps}
          title="Open progress and settings"
        >
          <UserRound size={17} />
          Grown-ups
        </button>
      </header>

      <main className="unit-main">
        <section className="unit-intro">
          <div className="unit-intro__copy">
            <p className="section-kicker">Current destination</p>
            <h1>{unit.chinese}</h1>
            <p>{unit.description}</p>
          </div>

          <div className="word-strip" aria-label={`${unit.chinese} vocabulary`}>
            {unit.words.map((wordId) => {
              const word = WORDS[wordId];
              return (
                <div className="word-chip" key={wordId}>
                  <img src={word.image} alt="" />
                  <strong>{word.hanzi}</strong>
                  <span className={showPinyin ? "" : "is-hidden"}>
                    {showPinyin ? word.pinyin : word.english}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="challenge-section" aria-labelledby="challenge-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Three lantern challenges</p>
              <h2 id="challenge-heading">
                {allComplete ? "World complete" : "Choose your next challenge"}
              </h2>
            </div>
            <div className="unit-star-total">
              <Star size={20} fill="currentColor" />
              {unitStars} / 9 stars
            </div>
          </div>

          <div className="challenge-grid">
            {GAME_IDS.map((gameId) => {
              const Icon = GAME_ICONS[gameId];
              const meta = GAME_META[gameId];
              const stars = progress[unit.id][gameId];
              return (
                <button
                  className="challenge-card"
                  key={gameId}
                  onClick={() => onStartGame(gameId)}
                >
                  <span className="challenge-card__top">
                    <span className="challenge-card__icon">
                      <Icon size={26} />
                    </span>
                    {stars > 0 && (
                      <span className="challenge-card__complete">
                        <Check size={15} /> Complete
                      </span>
                    )}
                  </span>
                  <span className="challenge-card__title">{meta.title}</span>
                  <span className="challenge-card__chinese">{meta.chinese}</span>
                  <span className="challenge-card__description">{meta.instruction}</span>
                  <span className="challenge-card__stars" aria-label={`${stars} of 3 stars`}>
                    {[0, 1, 2].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={star < stars ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
