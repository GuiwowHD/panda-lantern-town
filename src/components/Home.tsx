import {
  ArrowRight,
  Languages,
  LockKeyhole,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import type { CSSProperties } from "react";
import { UNITS, WORDS } from "../data";
import {
  getCompletedGames,
  getContinueUnit,
  getTotalStars,
  getUnitStars,
  isUnitUnlocked,
} from "../progress";
import type { GameProgress, UnitId } from "../types";

interface HomeProps {
  progress: GameProgress;
  showPinyin: boolean;
  onOpenUnit: (unitId: UnitId) => void;
  onOpenGrownUps: () => void;
  onTogglePinyin: () => void;
}

export function Home({
  progress,
  showPinyin,
  onOpenUnit,
  onOpenGrownUps,
  onTogglePinyin,
}: HomeProps) {
  const continueUnit = getContinueUnit(progress);
  const totalStars = getTotalStars(progress);
  const totalPossibleStars = UNITS.length * 9;

  return (
    <div className="home">
      <section className="hero">
        <nav className="topbar">
          <span className="brand-mark">KK</span>
          <span className="brand-name">Panda Lantern Town</span>
          <div className="topbar-actions">
            <button
              className={showPinyin ? "topbar-button is-active" : "topbar-button"}
              onClick={onTogglePinyin}
              aria-pressed={showPinyin}
              title="Toggle pinyin helpers"
            >
              <Languages size={17} />
              Pinyin
            </button>
            <button
              className="topbar-button"
              onClick={onOpenGrownUps}
              title="Open progress and settings"
            >
              <UserRound size={17} />
              Grown-ups
            </button>
          </div>
        </nav>

        <img className="hero-panda" src="/assets/panda-guide.png" alt="" />
        <div className="hero-copy">
          <p className="hero-kicker">A four-stop Mandarin adventure</p>
          <h1>
            Light the lanterns.
            <span>Grow your Chinese.</span>
          </h1>
          <p className="hero-description">
            Travel through four small worlds, listen to real Mandarin, and build
            useful words and phrases one lantern at a time.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onOpenUnit(continueUnit.id)}>
              <Sparkles size={19} />
              Continue in {continueUnit.chinese}
            </button>
            <span className="hero-note">
              {totalStars} of {totalPossibleStars} stars collected
            </span>
          </div>
        </div>
      </section>

      <section className="journey" aria-labelledby="journey-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Your lantern road</p>
            <h2 id="journey-heading">Four places to explore</h2>
          </div>
          <p>
            Finish two challenges in a world to unlock the next stop on the road.
          </p>
        </div>

        <div className="unit-grid">
          {UNITS.map((unit, index) => {
            const unlocked = isUnitUnlocked(progress, unit.id);
            const stars = getUnitStars(progress[unit.id]);
            const completed = getCompletedGames(progress, unit.id);
            return (
              <button
                className={`unit-card ${unlocked ? "" : "is-locked"}`}
                key={unit.id}
                onClick={() => unlocked && onOpenUnit(unit.id)}
                disabled={!unlocked}
                style={
                  {
                    "--unit-color": unit.color,
                    "--unit-surface": unit.surface,
                    "--unit-delay": `${index * 60}ms`,
                  } as CSSProperties
                }
              >
                <span className="unit-card__number">{unit.number}</span>
                <span className="unit-card__status">
                  {unlocked ? (
                    completed === 3 ? (
                      "World complete"
                    ) : (
                      `${completed} of 3 challenges`
                    )
                  ) : (
                    <>
                      <LockKeyhole size={15} /> Complete 2 challenges before this
                    </>
                  )}
                </span>
                <span className="unit-card__title">{unit.title}</span>
                <span className="unit-card__chinese">{unit.chinese}</span>
                <span className="unit-card__description">{unit.description}</span>

                <span className="unit-card__words" aria-hidden="true">
                  {unit.words.slice(0, 3).map((wordId) => (
                    <img key={wordId} src={WORDS[wordId].image} alt="" />
                  ))}
                </span>

                <span className="unit-card__footer">
                  <span className="unit-card__stars">
                    {[0, 1, 2].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star < Math.ceil(stars / 3) ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                  <span className="unit-card__arrow">
                    {unlocked ? <ArrowRight size={18} /> : <LockKeyhole size={17} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
