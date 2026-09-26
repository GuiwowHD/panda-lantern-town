import { UNITS } from "./data";
import type { GameId, GameProgress, UnitId, UnitProgress } from "./types";

export const GAME_IDS: GameId[] = ["listen", "tones", "order"];

export const EMPTY_UNIT_PROGRESS: UnitProgress = {
  listen: 0,
  tones: 0,
  order: 0,
};

export function createEmptyProgress(): GameProgress {
  return Object.fromEntries(
    UNITS.map((unit) => [unit.id, { ...EMPTY_UNIT_PROGRESS }]),
  ) as GameProgress;
}

export function getUnitStars(progress: UnitProgress) {
  return GAME_IDS.reduce((total, gameId) => total + progress[gameId], 0);
}

export function getTotalStars(progress: GameProgress) {
  return UNITS.reduce((total, unit) => total + getUnitStars(progress[unit.id]), 0);
}

export function getCompletedGames(progress: GameProgress, unitId: UnitId) {
  return GAME_IDS.filter((gameId) => progress[unitId][gameId] > 0).length;
}

export function isUnitUnlocked(progress: GameProgress, unitId: UnitId) {
  const index = UNITS.findIndex((unit) => unit.id === unitId);
  if (index <= 0) return true;
  return getCompletedGames(progress, UNITS[index - 1].id) >= 2;
}

export function getContinueUnit(progress: GameProgress) {
  return (
    UNITS.find(
      (unit) =>
        isUnitUnlocked(progress, unit.id) && getCompletedGames(progress, unit.id) < 3,
    ) ?? UNITS[UNITS.length - 1]
  );
}

export function getRating(score: number, total: number) {
  return score >= total * 0.9 ? 3 : score >= total * 0.65 ? 2 : 1;
}
