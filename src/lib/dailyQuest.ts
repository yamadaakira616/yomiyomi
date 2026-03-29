/**
 * Daily Quest system — date-seeded so the quest changes at midnight,
 * same quest for all players on the same day (no randomness per user).
 */

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number; // how many times to achieve
  coinReward: number;
  xpReward: number;
  type: "read" | "perfect_quiz" | "inference" | "streak";
};

const QUEST_POOL: DailyQuest[] = [
  {
    id: "read2",
    title: "2さつよもう",
    description: "きょう2さつ本を読もう！",
    emoji: "📚",
    target: 2,
    coinReward: 80,
    xpReward: 40,
    type: "read",
  },
  {
    id: "perfect1",
    title: "かんぺきクイズ",
    description: "クイズを全問正解しよう！",
    emoji: "⭐",
    target: 1,
    coinReward: 100,
    xpReward: 60,
    type: "perfect_quiz",
  },
  {
    id: "inference2",
    title: "かんがえよう",
    description: "かんがえもんだいに2つ答えよう",
    emoji: "🤔",
    target: 2,
    coinReward: 60,
    xpReward: 30,
    type: "inference",
  },
  {
    id: "read1",
    title: "1さつよもう",
    description: "きょう本を1さつ読もう！",
    emoji: "📖",
    target: 1,
    coinReward: 50,
    xpReward: 25,
    type: "read",
  },
  {
    id: "perfect2",
    title: "ダブルパーフェクト",
    description: "クイズを2つ全問正解しよう！",
    emoji: "🏆",
    target: 2,
    coinReward: 150,
    xpReward: 80,
    type: "perfect_quiz",
  },
  {
    id: "inference3",
    title: "かんがえはかせ",
    description: "かんがえもんだいに3つ答えよう",
    emoji: "🧠",
    target: 3,
    coinReward: 90,
    xpReward: 45,
    type: "inference",
  },
];

/** Get today's quest using date as seed (same quest for everyone on the same day) */
export function getTodayQuest(): DailyQuest {
  const today = new Date().toISOString().split("T")[0];
  // Simple hash: sum of char codes mod pool length
  const hash = today.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return QUEST_POOL[hash % QUEST_POOL.length];
}

export type QuestProgress = {
  date: string;
  questId: string;
  progress: number;
  completed: boolean;
};

const QUEST_STORAGE_KEY = "yomiyomi-v2-daily-quest";

function getQuestStorage(): Record<string, QuestProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveQuestStorage(data: Record<string, QuestProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(data));
}

export function getQuestProgress(profileId: string): QuestProgress {
  const today = new Date().toISOString().split("T")[0];
  const quest = getTodayQuest();
  const storage = getQuestStorage();
  const key = `${profileId}-${today}`;

  if (!storage[key] || storage[key].questId !== quest.id) {
    // New day or new quest
    const fresh: QuestProgress = {
      date: today,
      questId: quest.id,
      progress: 0,
      completed: false,
    };
    storage[key] = fresh;
    saveQuestStorage(storage);
    return fresh;
  }
  return storage[key];
}

export type QuestReward = {
  justCompleted: boolean;
  coinReward: number;
  xpReward: number;
};

/** Increment progress for a quest type. Returns reward info if just completed. */
export function incrementQuestProgress(
  profileId: string,
  type: DailyQuest["type"],
  amount = 1
): QuestReward {
  const today = new Date().toISOString().split("T")[0];
  const quest = getTodayQuest();
  if (quest.type !== type) return { justCompleted: false, coinReward: 0, xpReward: 0 };

  const storage = getQuestStorage();
  const key = `${profileId}-${today}`;
  const current = storage[key] ?? { date: today, questId: quest.id, progress: 0, completed: false };

  if (current.completed) return { justCompleted: false, coinReward: 0, xpReward: 0 };

  current.progress = Math.min(quest.target, current.progress + amount);
  const justCompleted = current.progress >= quest.target;
  if (justCompleted) current.completed = true;

  storage[key] = current;
  saveQuestStorage(storage);
  return {
    justCompleted,
    coinReward: justCompleted ? quest.coinReward : 0,
    xpReward: justCompleted ? quest.xpReward : 0,
  };
}
