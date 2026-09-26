import { useEffect, useState } from "react";
import { useAudio } from "./audio";
import { FinishPanel } from "./components/FinishPanel";
import { GrownUpsPanel } from "./components/GrownUpsPanel";
import { Home } from "./components/Home";
import { ListenGame } from "./components/ListenGame";
import { OrderGame } from "./components/OrderGame";
import { ToneGame } from "./components/ToneGame";
import { UnitScreen } from "./components/UnitScreen";
import { GAME_META, UNITS, getUnit } from "./data";
import {
  createEmptyProgress,
  getRating,
  isUnitUnlocked,
} from "./progress";
import type { GameId, GameProgress, GameSettings, UnitId } from "./types";

type Route =
  | { screen: "home" }
  | { screen: "unit"; unitId: UnitId }
  | { screen: "game"; unitId: UnitId; gameId: GameId }
  | { screen: "grownups" };

const GAME_IDS: GameId[] = ["listen", "tones", "order"];

function isUnitId(value: string): value is UnitId {
  return UNITS.some((unit) => unit.id === value);
}

function isGameId(value: string): value is GameId {
  return GAME_IDS.includes(value as GameId);
}

function parseRoute(): Route {
  const [section, unitId, gameId] = window.location.hash.replace(/^#\/?/, "").split("/");
  if (section === "grownups") return { screen: "grownups" };
  if (section === "unit" && unitId && isUnitId(unitId)) {
    if (gameId && isGameId(gameId)) return { screen: "game", unitId, gameId };
    return { screen: "unit", unitId };
  }
  return { screen: "home" };
}

function routeHash(route: Route) {
  if (route.screen === "home") return "";
  if (route.screen === "grownups") return "grownups";
  if (route.screen === "unit") return `unit/${route.unitId}`;
  return `unit/${route.unitId}/${route.gameId}`;
}

function readProgress(): GameProgress {
  const empty = createEmptyProgress();
  try {
    const savedV2 = window.localStorage.getItem("panda-lantern-progress-v2");
    if (savedV2) {
      const parsed = JSON.parse(savedV2) as Partial<GameProgress>;
      return Object.fromEntries(
        UNITS.map((unit) => [
          unit.id,
          { ...empty[unit.id], ...(parsed[unit.id] ?? {}) },
        ]),
      ) as GameProgress;
    }

    const legacy = window.localStorage.getItem("panda-lantern-progress");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<Record<GameId, number>>;
      empty.market = {
        listen: parsed.listen ?? 0,
        tones: parsed.tones ?? 0,
        order: parsed.order ?? 0,
      };
    }
  } catch {
    return empty;
  }
  return empty;
}

function readSettings(): GameSettings {
  try {
    const saved = window.localStorage.getItem("panda-lantern-settings");
    return saved ? { showPinyin: true, ...JSON.parse(saved) } : { showPinyin: true };
  } catch {
    return { showPinyin: true };
  }
}

export default function App() {
  const { play, playSfx } = useAudio();
  const [route, setRoute] = useState<Route>(parseRoute);
  const [progress, setProgress] = useState<GameProgress>(readProgress);
  const [settings, setSettings] = useState<GameSettings>(readSettings);
  const [result, setResult] = useState<{
    unitId: UnitId;
    gameId: GameId;
    score: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    window.localStorage.setItem("panda-lantern-progress-v2", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem("panda-lantern-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(parseRoute());
      setResult(null);
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const navigate = (nextRoute: Route) => {
    setResult(null);
    setRoute(nextRoute);
    window.location.hash = routeHash(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openUnit = (unitId: UnitId) => {
    if (!isUnitUnlocked(progress, unitId)) return;
    navigate({ screen: "unit", unitId });
  };

  const completeGame = (unitId: UnitId, gameId: GameId, score: number, total: number) => {
    const rating = getRating(score, total);
    setProgress((current) => ({
      ...current,
      [unitId]: {
        ...current[unitId],
        [gameId]: Math.max(current[unitId][gameId], rating),
      },
    }));
    setResult({ unitId, gameId, score, total });
  };

  if (route.screen === "home") {
    return (
      <Home
        progress={progress}
        showPinyin={settings.showPinyin}
        onOpenUnit={openUnit}
        onOpenGrownUps={() => navigate({ screen: "grownups" })}
        onTogglePinyin={() =>
          setSettings((current) => ({ ...current, showPinyin: !current.showPinyin }))
        }
      />
    );
  }

  if (route.screen === "grownups") {
    return (
      <GrownUpsPanel
        progress={progress}
        showPinyin={settings.showPinyin}
        onBack={() => navigate({ screen: "home" })}
        onTogglePinyin={() =>
          setSettings((current) => ({ ...current, showPinyin: !current.showPinyin }))
        }
        onReset={() => {
          setProgress(createEmptyProgress());
          setResult(null);
        }}
      />
    );
  }

  const unit = getUnit(route.unitId);
  if (!isUnitUnlocked(progress, route.unitId)) {
    return (
      <Home
        progress={progress}
        showPinyin={settings.showPinyin}
        onOpenUnit={openUnit}
        onOpenGrownUps={() => navigate({ screen: "grownups" })}
        onTogglePinyin={() =>
          setSettings((current) => ({ ...current, showPinyin: !current.showPinyin }))
        }
      />
    );
  }

  if (route.screen === "unit") {
    return (
      <UnitScreen
        unit={unit}
        progress={progress}
        showPinyin={settings.showPinyin}
        onBack={() => navigate({ screen: "home" })}
        onOpenGrownUps={() => navigate({ screen: "grownups" })}
        onStartGame={(gameId) => navigate({ screen: "game", unitId: unit.id, gameId })}
      />
    );
  }

  if (result) {
    return (
      <div className="result-screen">
        <FinishPanel
          title={`${unit.chinese} · ${GAME_META[result.gameId].title}`}
          score={result.score}
          total={result.total}
          onReplay={() => {
            setResult(null);
            setRoute({ screen: "game", unitId: result.unitId, gameId: result.gameId });
          }}
          onHome={() => navigate({ screen: "unit", unitId: result.unitId })}
        />
      </div>
    );
  }

  const gameProps = {
    unit,
    showPinyin: settings.showPinyin,
    play,
    playSfx,
    onBack: () => navigate({ screen: "unit", unitId: unit.id }),
    onComplete: (score: number, total: number) =>
      completeGame(unit.id, route.gameId, score, total),
  };

  if (route.gameId === "listen") return <ListenGame {...gameProps} />;
  if (route.gameId === "tones") return <ToneGame {...gameProps} />;
  return <OrderGame {...gameProps} />;
}
