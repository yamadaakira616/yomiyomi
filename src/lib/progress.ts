import { STORIES } from "@/data/stories";
import { ACHIEVEMENTS, type AchievementStats } from "@/data/achievements";

export type StoryProgress = {
  storyId: string;
  completed: boolean;
  perfectQuiz: boolean;
  stickerEarned: boolean;
  completedAt?: string;
};

export type ProfileProgress = {
  profileId: string;
  stories: Record<string, StoryProgress>;
  coins: number;
  totalCoinsEarned: number;
  xp: number;
  streak: number;
  lastReadDate?: string;
  achievements: string[]; // unlocked achievement IDs
  gachaCharacters: string[]; // owned gacha character IDs
  inferencesAnswered: number;
  perfectQuizCount: number;
  petHappiness: number; // 0-100, stored base value (before daily decay)
};

const STORAGE_KEY = "yomiyomi-v2-progress";

function getStorage(): Record<string, ProfileProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStorage(data: Record<string, ProfileProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProfileProgress(profileId: string): ProfileProgress {
  const storage = getStorage();
  if (!storage[profileId]) {
    return {
      profileId,
      stories: {},
      coins: 0,
      totalCoinsEarned: 0,
      xp: 0,
      streak: 0,
      achievements: [],
      gachaCharacters: [],
      inferencesAnswered: 0,
      perfectQuizCount: 0,
      petHappiness: 50,
    };
  }
  // Ensure new fields exist for old saves
  const p = storage[profileId];
  const defaults: Omit<ProfileProgress, "profileId" | "stories"> = {
    coins: 0,
    totalCoinsEarned: 0,
    xp: 0,
    streak: 0,
    achievements: [],
    gachaCharacters: [],
    inferencesAnswered: 0,
    perfectQuizCount: 0,
    petHappiness: 50,
  };
  return { ...defaults, ...p };
}

export type RewardSummary = {
  coinsEarned: number;
  xpEarned: number;
  newAchievements: string[];
  isFirstTime: boolean;
  streakBonus: number;
};

export function markStoryComplete(
  profileId: string,
  storyId: string,
  correctAnswers: number,
  totalNonInference: number,
  inferencesAnswered: number
): RewardSummary {
  const storage = getStorage();
  if (!storage[profileId]) {
    storage[profileId] = getProfileProgress(profileId);
  }
  const p = storage[profileId];

  const story = STORIES.find((s) => s.id === storyId);
  const isFirstTime = !p.stories[storyId]?.completed;
  const perfectQuiz = correctAnswers === totalNonInference && totalNonInference > 0;

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  let streakBonus = 0;
  if (p.lastReadDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (p.lastReadDate === yesterdayStr) {
      p.streak = (p.streak || 0) + 1;
      streakBonus = 30;
    } else if (p.lastReadDate !== today) {
      p.streak = 1;
    }
  } else {
    p.streak = 1;
    streakBonus = 0;
  }
  p.lastReadDate = today;

  // Calculate rewards
  // 初回・再読で基本報酬を分ける
  let coinsEarned = isFirstTime ? (story?.readCoins ?? 500) : 20;
  let xpEarned = isFirstTime ? (story?.readXp ?? 100) : 10;

  // Quiz performance bonuses (3問全問正解で 75×3+75=300 → 合計800)
  coinsEarned += correctAnswers * 75;
  xpEarned += correctAnswers * 20;
  if (perfectQuiz) {
    coinsEarned += 75;
    xpEarned += 50;
  }

  // Inference bonus (for thoughtful reflection)
  coinsEarned += inferencesAnswered * 20;
  xpEarned += inferencesAnswered * 10;

  // Streak bonus
  coinsEarned += streakBonus;

  // Update profile state
  p.coins = (p.coins || 0) + coinsEarned;
  p.totalCoinsEarned = (p.totalCoinsEarned || 0) + coinsEarned;
  p.xp = (p.xp || 0) + xpEarned;
  p.inferencesAnswered = (p.inferencesAnswered || 0) + inferencesAnswered;
  if (perfectQuiz) p.perfectQuizCount = (p.perfectQuizCount || 0) + 1;
  // Pet happiness boost from reading
  p.petHappiness = Math.min(100, (p.petHappiness || 50) + (perfectQuiz ? 30 : 20));

  p.stories[storyId] = {
    storyId,
    completed: true,
    perfectQuiz,
    stickerEarned: true,
    completedAt: new Date().toISOString(),
  };

  // Check achievements
  const prevAchievements = new Set(p.achievements || []);
  const stats: AchievementStats = {
    storiesCompleted: Object.values(p.stories).filter((s) => s.completed).length,
    perfectQuizzes: p.perfectQuizCount,
    streak: p.streak,
    totalCoins: p.totalCoinsEarned,
    gachaCharacters: (p.gachaCharacters || []).length,
    inferencesAnswered: p.inferencesAnswered,
  };

  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!prevAchievements.has(ach.id) && ach.condition(stats)) {
      p.achievements.push(ach.id);
      p.coins += ach.coinReward;
      p.xp += ach.xpReward;
      newlyUnlocked.push(ach.id);
    }
  }

  storage[profileId] = p;
  saveStorage(storage);

  return {
    coinsEarned,
    xpEarned,
    newAchievements: newlyUnlocked,
    isFirstTime,
    streakBonus,
  };
}

export function spendCoinsForGacha(
  profileId: string,
  cost: number,
  characterId: string
): boolean {
  const storage = getStorage();
  if (!storage[profileId]) return false;

  const p = storage[profileId];
  if ((p.coins || 0) < cost) return false;

  p.coins -= cost;
  p.gachaCharacters = [...(p.gachaCharacters || []), characterId];

  // Check gacha achievements
  const stats: AchievementStats = {
    storiesCompleted: Object.values(p.stories).filter((s) => s.completed).length,
    perfectQuizzes: p.perfectQuizCount || 0,
    streak: p.streak || 0,
    totalCoins: p.totalCoinsEarned || 0,
    gachaCharacters: p.gachaCharacters.length,
    inferencesAnswered: p.inferencesAnswered || 0,
  };

  for (const ach of ACHIEVEMENTS) {
    if (!p.achievements.includes(ach.id) && ach.condition(stats)) {
      p.achievements.push(ach.id);
      p.coins += ach.coinReward;
      p.xp += ach.xpReward;
    }
  }

  storage[profileId] = p;
  saveStorage(storage);
  return true;
}

export function getEarnedStickers(profileId: string): string[] {
  const progress = getProfileProgress(profileId);
  const profileStories = STORIES.filter((s) => s.profileId === profileId);
  return profileStories
    .filter((s) => progress.stories[s.id]?.stickerEarned)
    .map((s) => s.id);
}

export function getTotalStars(profileId: string): number {
  const progress = getProfileProgress(profileId);
  return Object.values(progress.stories).filter((s) => s.completed).length;
}

export function isStoryCompleted(profileId: string, storyId: string): boolean {
  const progress = getProfileProgress(profileId);
  return !!progress.stories[storyId]?.completed;
}

export function addReward(profileId: string, coins: number, xp: number): string[] {
  const storage = getStorage();
  if (!storage[profileId]) storage[profileId] = getProfileProgress(profileId);
  const p = storage[profileId];

  p.coins = (p.coins || 0) + coins;
  p.totalCoinsEarned = (p.totalCoinsEarned || 0) + coins;
  p.xp = (p.xp || 0) + xp;

  const prevAchievements = new Set(p.achievements || []);
  const stats: AchievementStats = {
    storiesCompleted: Object.values(p.stories).filter((s) => s.completed).length,
    perfectQuizzes: p.perfectQuizCount || 0,
    streak: p.streak || 0,
    totalCoins: p.totalCoinsEarned,
    gachaCharacters: (p.gachaCharacters || []).length,
    inferencesAnswered: p.inferencesAnswered || 0,
  };
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!prevAchievements.has(ach.id) && ach.condition(stats)) {
      p.achievements.push(ach.id);
      p.coins += ach.coinReward;
      p.xp += ach.xpReward;
      newlyUnlocked.push(ach.id);
    }
  }

  storage[profileId] = p;
  saveStorage(storage);
  return newlyUnlocked;
}

export function resetProgress(profileId: string) {
  const storage = getStorage();
  delete storage[profileId];
  saveStorage(storage);
}
