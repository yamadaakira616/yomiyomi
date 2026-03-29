"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PROFILES, STORIES } from "@/data/stories";
import { getProfileProgress, getEarnedStickers } from "@/lib/progress";
import { getLevelFromXp, getNextLevel, ACHIEVEMENTS } from "@/data/achievements";
import { getPetStage, computeHappiness, getHappinessMood } from "@/data/pet";
import { getTodayQuest, getQuestProgress, type QuestProgress, type DailyQuest } from "@/lib/dailyQuest";
import { useEffect, useState } from "react";

export default function StoryListPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";

  const profile = PROFILES.find((p) => p.id === profileId);
  const stories = STORIES.filter((s) => s.profileId === profileId);

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedIds, setEarnedIds] = useState<string[]>([]);
  const [achievementCount, setAchievementCount] = useState(0);
  const [petEmoji, setPetEmoji] = useState("🥚");
  const [petMoodDot, setPetMoodDot] = useState("");
  const [dailyQuest, setDailyQuest] = useState<DailyQuest | null>(null);
  const [questProgress, setQuestProgress] = useState<QuestProgress | null>(null);

  useEffect(() => {
    const progress = getProfileProgress(profileId);
    const completed = new Set(
      Object.entries(progress.stories)
        .filter(([, v]) => v.completed)
        .map(([k]) => k)
    );
    setCompletedIds(completed);
    setEarnedIds(getEarnedStickers(profileId));
    setCoins(progress.coins || 0);
    setXp(progress.xp || 0);
    setStreak(progress.streak || 0);
    setAchievementCount((progress.achievements || []).length);
    // Pet quick status
    const stage = getPetStage(profileId as "mushi" | "stamp", completed.size);
    const happiness = computeHappiness(progress.lastReadDate, progress.petHappiness ?? 50);
    const petMood = getHappinessMood(happiness);
    const petE = petMood === "happy" ? stage.happyEmoji : petMood === "sad" ? stage.sadEmoji : stage.emoji;
    setPetEmoji(petE);
    setPetMoodDot(petMood === "happy" ? "🟢" : petMood === "sad" ? "🔴" : "🟡");
    // Daily quest
    const quest = getTodayQuest();
    const qProgress = getQuestProgress(profileId);
    setDailyQuest(quest);
    setQuestProgress(qProgress);
  }, [profileId]);

  if (!profile) {
    router.replace("/");
    return null;
  }

  const completedCount = completedIds.size;
  const progressPct = Math.round((completedCount / stories.length) * 100);
  const currentLevel = getLevelFromXp(xp);
  const nextLevel = getNextLevel(xp);
  const xpToNext = nextLevel ? nextLevel.minXp - xp : 0;
  const xpInLevel = nextLevel
    ? xp - (ACHIEVEMENTS.find(() => false) ? 0 : getLevelFromXp(xp - 1).minXp ?? 0)
    : 0;
  void xpInLevel;

  return (
    <main
      className={`min-h-screen ${profile.bgColor} pb-24`}
      style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif" }}
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} p-5 pb-12 shadow-lg`}>
        <div className="max-w-2xl mx-auto">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/")}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 bg-white/20 rounded-full px-3 py-1"
            >
              ← もどる
            </button>
            {/* Coin display */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-xl">🪙</span>
              <span className="text-white font-black text-base">{coins}</span>
            </div>
          </div>

          {/* Profile info + level */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              className="text-6xl"
            >
              {profile.emoji}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-black text-xl drop-shadow">{profile.name}</span>
                <span className="bg-white/25 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {currentLevel.emoji} {currentLevel.name}
                </span>
              </div>
              <p className="text-white/80 text-sm">
                {completedCount} / {stories.length} 冊 ·
                {streak > 0 && <span className="ml-1">🔥 {streak}日れんぞく</span>}
              </p>
              {/* XP bar */}
              {nextLevel && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>XP: {xp}</span>
                    <span>次のレベルまで {xpToNext} XP</span>
                  </div>
                  <div className="bg-white/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, ((xp - getLevelFromXp(xp - 1).minXp) / (nextLevel.minXp - getLevelFromXp(xp - 1).minXp)) * 100)}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Story progress bar */}
          <div className="mt-4 bg-white/30 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          {progressPct === 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white text-sm font-bold mt-2 text-center"
            >
              🎉 ぜんぶよんだ！すごい！！
            </motion.p>
          )}
        </div>
      </div>

      {/* Quick action row */}
      <div className="max-w-2xl mx-auto px-4 -mt-5 mb-4 flex gap-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${profileId}/gacha`)}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3 text-white shadow-lg flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🎰</span>
          <div className="text-left">
            <p className="font-black text-sm">キャラガチャ</p>
            <p className="text-xs text-white/80">🪙{coins} で引く</p>
          </div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${profileId}/collection`)}
          className="flex-1 bg-white rounded-2xl p-3 shadow-lg flex items-center justify-center gap-2"
        >
          <span className="text-2xl">{profile.emoji}</span>
          <div className="text-left">
            <p className="font-black text-sm text-gray-700">{profile.stickerLabel}</p>
            <p className="text-xs text-gray-400">{earnedIds.length} まいゲット</p>
          </div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${profileId}/achievements`)}
          className="bg-white rounded-2xl p-3 shadow-lg flex flex-col items-center justify-center gap-1"
        >
          <span className="text-2xl">🏆</span>
          <p className="text-xs font-bold text-gray-600">{achievementCount}</p>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${profileId}/pet`)}
          className="bg-white rounded-2xl p-3 shadow-lg flex flex-col items-center justify-center gap-1 relative"
        >
          <span className="text-2xl">{petEmoji}</span>
          <p className="text-xs font-bold text-gray-600">{petMoodDot}</p>
        </motion.button>
      </div>

      {/* Daily Quest card */}
      {dailyQuest && questProgress && (
        <div className="max-w-2xl mx-auto px-4 mb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={`rounded-2xl p-4 shadow ${questProgress.completed ? "bg-green-50 border-2 border-green-300" : "bg-yellow-50 border-2 border-yellow-200"}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{dailyQuest.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-gray-800 text-sm">{dailyQuest.title}</p>
                  {questProgress.completed && (
                    <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-bold">クリア！</span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">きょうのミッション</span>
                </div>
                <p className="text-xs text-gray-500">{dailyQuest.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(questProgress.progress / dailyQuest.target) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${questProgress.completed ? "bg-green-500" : "bg-yellow-400"}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{questProgress.progress}/{dailyQuest.target}</span>
                  <span className="text-xs text-amber-600 font-bold">🪙+{dailyQuest.coinReward}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Boss Battle banner */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/${profileId}/boss`)}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg flex items-center gap-4 border border-gray-700"
        >
          <span className="text-4xl">{profileId === "mushi" ? "🦗" : "🧙‍♀️"}</span>
          <div className="text-left flex-1">
            <p className="font-black text-white text-base">⚔️ ボスバトル</p>
            <p className="text-gray-400 text-xs">全問クイズで強敵をたおせ！</p>
          </div>
          <span className="text-gray-500 text-sm">→</span>
        </motion.button>
      </div>

      {/* Story cards */}
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-sm font-bold text-gray-500 mb-3 px-1">📖 おはなしをえらぼう</h2>
        <div className="grid grid-cols-1 gap-4">
          {stories.map((story, index) => {
            const done = completedIds.has(story.id);
            return (
              <motion.button
                key={story.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/${profileId}/story/${story.id}`)}
                className={`
                  relative overflow-hidden rounded-2xl shadow-md p-5 text-left w-full
                  border-2 transition-all
                  ${done
                    ? "bg-white border-green-300"
                    : `${story.color} border-transparent hover:shadow-lg`
                  }
                `}
              >
                {done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow"
                  >
                    ✓
                  </motion.div>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">{story.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        第{index + 1}話
                      </span>
                      {done && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                          よんだ！
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-gray-800 leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{story.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>🪙 +{story.readCoins} コイン</span>
                      <span>⭐ +{story.readXp} XP</span>
                    </div>
                    {done && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-lg">{story.stickerEmoji}</span>
                        <span className="text-xs text-gray-500">{story.stickerName} ゲット！</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          {completedCount === 0 && "👆 どのおはなしから読もうかな？"}
          {completedCount > 0 && completedCount < stories.length && `あと ${stories.length - completedCount} 冊！がんばろう 💪`}
        </motion.div>
      </div>
    </main>
  );
}
