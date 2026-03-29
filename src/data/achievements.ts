export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (stats: AchievementStats) => boolean;
  coinReward: number;
  xpReward: number;
};

export type AchievementStats = {
  storiesCompleted: number;
  perfectQuizzes: number;
  streak: number;
  totalCoins: number;
  gachaCharacters: number;
  inferencesAnswered: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_story",
    name: "はじめての一冊",
    description: "はじめておはなしをよみおえた！",
    emoji: "📖",
    condition: (s) => s.storiesCompleted >= 1,
    coinReward: 100,
    xpReward: 50,
  },
  {
    id: "three_stories",
    name: "どくしょか",
    description: "３つのおはなしをよんだ！",
    emoji: "📚",
    condition: (s) => s.storiesCompleted >= 3,
    coinReward: 150,
    xpReward: 80,
  },
  {
    id: "all_stories",
    name: "ぜんぶよんだ！",
    description: "コースのおはなしをぜんぶよんだ！！",
    emoji: "🏆",
    condition: (s) => s.storiesCompleted >= 5,
    coinReward: 500,
    xpReward: 200,
  },
  {
    id: "perfect_quiz",
    name: "クイズマスター",
    description: "クイズをぜんもんせいかい！",
    emoji: "🎯",
    condition: (s) => s.perfectQuizzes >= 1,
    coinReward: 200,
    xpReward: 100,
  },
  {
    id: "perfect_3",
    name: "てんさいはかせ",
    description: "３かいかんぺきにクイズをクリア！",
    emoji: "🧠",
    condition: (s) => s.perfectQuizzes >= 3,
    coinReward: 300,
    xpReward: 150,
  },
  {
    id: "streak_3",
    name: "３日れんぞく",
    description: "３日つづけてよんだ！すごい！",
    emoji: "🔥",
    condition: (s) => s.streak >= 3,
    coinReward: 150,
    xpReward: 75,
  },
  {
    id: "streak_7",
    name: "いっしゅうかんよみびと",
    description: "７日つづけてよんだ！かいきんき！",
    emoji: "💎",
    condition: (s) => s.streak >= 7,
    coinReward: 500,
    xpReward: 250,
  },
  {
    id: "first_gacha",
    name: "はじめてのガチャ",
    description: "はじめてガチャをひいた！",
    emoji: "🎰",
    condition: (s) => s.gachaCharacters >= 1,
    coinReward: 100,
    xpReward: 50,
  },
  {
    id: "gacha_all",
    name: "キャラコンプリート！",
    description: "ガチャのキャラをぜんぶあつめた！！",
    emoji: "🌟",
    condition: (s) => s.gachaCharacters >= 5,
    coinReward: 1000,
    xpReward: 500,
  },
  {
    id: "deep_thinker",
    name: "かんがえるひと",
    description: "5かいかんがえるもんだいにこたえた！",
    emoji: "💭",
    condition: (s) => s.inferencesAnswered >= 5,
    coinReward: 150,
    xpReward: 80,
  },
  {
    id: "rich",
    name: "コインおちょうじゃ",
    description: "500コインいじょうたまった！",
    emoji: "🪙",
    condition: (s) => s.totalCoins >= 500,
    coinReward: 100,
    xpReward: 50,
  },
];

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, name: "よみはじめ", emoji: "🌱" },
  { level: 2, minXp: 100, name: "よみまめ", emoji: "📗" },
  { level: 3, minXp: 250, name: "どくしょか", emoji: "📘" },
  { level: 4, minXp: 500, name: "ものしり", emoji: "📙" },
  { level: 5, minXp: 900, name: "どくしょはかせ", emoji: "🎓" },
];

export function getLevelFromXp(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.minXp) current = threshold;
  }
  return current;
}

export function getNextLevel(xp: number) {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp < LEVEL_THRESHOLDS[i].minXp) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return null; // max level
}
