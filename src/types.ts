export type GameId = "listen" | "tones" | "order";

export type UnitId = "market" | "friends" | "garden" | "home";

export type WordId =
  | "apple"
  | "banana"
  | "fish"
  | "water"
  | "bread"
  | "rice"
  | "cat"
  | "dog"
  | "bird"
  | "rabbit"
  | "horse"
  | "panda"
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "circle"
  | "star"
  | "mom"
  | "dad"
  | "me"
  | "love"
  | "run"
  | "eat";

export interface Word {
  id: WordId;
  hanzi: string;
  pinyin: string;
  english: string;
  audio: string;
  image: string;
  color: string;
}

export interface ToneRound {
  tone: 1 | 2 | 3 | 4;
  hanzi: string;
  pinyin: string;
  audio: string;
  label: string;
}

export interface OrderToken {
  id: string;
  hanzi: string;
  pinyin: string;
}

export interface OrderRound {
  audio: string;
  english: string;
  answer: string[];
  tokens: OrderToken[];
}

export interface Unit {
  id: UnitId;
  number: string;
  title: string;
  chinese: string;
  description: string;
  color: string;
  surface: string;
  words: WordId[];
  toneRounds: ToneRound[];
  orderRounds: OrderRound[];
}

export type UnitProgress = Record<GameId, number>;

export type GameProgress = Record<UnitId, UnitProgress>;

export interface GameSettings {
  showPinyin: boolean;
}
