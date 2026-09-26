import {
  ArrowLeft,
  BookOpenCheck,
  Languages,
  RotateCcw,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { CSSProperties } from "react";
import { GAME_META, UNITS } from "../data";
import { GAME_IDS, getTotalStars, getUnitStars, isUnitUnlocked } from "../progress";
import type { GameProgress } from "../types";

interface GrownUpsPanelProps {
  progress: GameProgress;
  showPinyin: boolean;
  onBack: () => void;
  onTogglePinyin: () => void;
  onReset: () => void;
}

export function GrownUpsPanel({
  progress,
  showPinyin,
  onBack,
  onTogglePinyin,
  onReset,
}: GrownUpsPanelProps) {
  const totalStars = getTotalStars(progress);

  const reset = () => {
    if (window.confirm("Reset all stars and unlock progress for this child?")) {
      onReset();
    }
  };

  return (
    <div className="grownups-screen">
      <header className="unit-header grownups-header">
        <button className="icon-button" onClick={onBack} aria-label="Back to town" title="Back to town">
          <ArrowLeft size={22} />
        </button>
        <div>
          <span>Parent and teacher view</span>
          <strong>Progress · 学习进度</strong>
        </div>
        <div className="grownups-total">
          <Star size={19} fill="currentColor" />
          {totalStars} / 36
        </div>
      </header>

      <main className="grownups-main">
        <section className="grownups-summary">
          <div className="grownups-summary__icon">
            <BookOpenCheck size={30} />
          </div>
          <div>
            <p className="section-kicker">Local progress report</p>
            <h1>Four worlds, twelve short challenges</h1>
            <p>
              Progress is stored only in this browser. Stars show the best completed
              result for each activity.
            </p>
          </div>
        </section>

        <section className="settings-band">
          <div>
            <Languages size={22} />
            <div>
              <strong>Pinyin helpers</strong>
              <span>Show pronunciation above or below Chinese text.</span>
            </div>
          </div>
          <button
            className={showPinyin ? "settings-toggle is-on" : "settings-toggle"}
            onClick={onTogglePinyin}
            aria-pressed={showPinyin}
          >
            <span />
            {showPinyin ? "On" : "Off"}
          </button>
        </section>

        <section className="progress-table" aria-label="Progress by world">
          {UNITS.map((unit) => {
            const unlocked = isUnitUnlocked(progress, unit.id);
            const unitStars = getUnitStars(progress[unit.id]);
            return (
              <article
                className="progress-row"
                key={unit.id}
                style={{ "--unit-color": unit.color, "--unit-surface": unit.surface } as CSSProperties}
              >
                <div className="progress-row__identity">
                  <span>{unit.number}</span>
                  <div>
                    <strong>{unit.title}</strong>
                    <small>
                      {unit.chinese} · {unlocked ? "Unlocked" : "Locked"}
                    </small>
                  </div>
                </div>
                <div className="progress-row__games">
                  {GAME_IDS.map((gameId) => (
                    <div key={gameId}>
                      <span>{GAME_META[gameId].title}</span>
                      <strong>
                        <Star size={15} fill="currentColor" />
                        {progress[unit.id][gameId]} / 3
                      </strong>
                    </div>
                  ))}
                </div>
                <div className="progress-row__total">
                  <strong>{unitStars}</strong>
                  <span>of 9 stars</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="privacy-note">
          <ShieldCheck size={22} />
          <div>
            <strong>Private by default</strong>
            <p>
              There is no account, advertising, or remote profile. Clearing browser
              data also clears this progress.
            </p>
          </div>
        </section>

        <button className="reset-button" onClick={reset}>
          <RotateCcw size={18} />
          Reset all progress
        </button>
      </main>
    </div>
  );
}
