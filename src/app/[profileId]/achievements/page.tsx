"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PROFILES } from "@/data/stories";
import { ACHIEVEMENTS } from "@/data/achievements";
import { getProfileProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";
  const profile = PROFILES.find((p) => p.id === profileId);

  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const p = getProfileProgress(profileId);
    setUnlockedIds(p.achievements || []);
    setXp(p.xp || 0);
    setCoins(p.totalCoinsEarned || 0);
  }, [profileId]);

  if (!profile) {
    router.replace("/");
    return null;
  }

  const bgClass = profileId === "mushi" ? "from-green-50 to-emerald-100" : "from-pink-50 to-rose-100";
  const unlockedCount = unlockedIds.length;

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgClass} pb-20`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} px-4 py-5 shadow-lg`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 bg-white/20 rounded-full px-3 py-1"
            >
              ← もどる
            </button>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-1">🏆</div>
            <h1 className="text-2xl font-black text-white drop-shadow">じっせきコレクション</h1>
            <p className="text-white/80 text-sm mt-1">
              {unlockedCount} / {ACHIEVEMENTS.length} かいじょ
            </p>
          </div>
          <div className="flex justify-center gap-6 mt-3 text-sm text-white/80">
            <span>⭐ 合計XP: {xp}</span>
            <span>🪙 累計コイン: {coins}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-gray-700">{unlockedCount}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${profile.bgGradient}`}
              />
            </div>
            <span className="text-gray-400 text-sm">/ {ACHIEVEMENTS.length}</span>
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 gap-3">
          {ACHIEVEMENTS.map((ach, index) => {
            const unlocked = unlockedIds.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-4 flex items-center gap-4 shadow transition-all
                  ${unlocked ? "bg-yellow-50 border-2 border-yellow-300" : "bg-white border-2 border-gray-100 opacity-60"}`}
              >
                <div className={`text-4xl ${!unlocked && "grayscale"}`}>
                  {unlocked ? ach.emoji : "🔒"}
                </div>
                <div className="flex-1">
                  <p className={`font-black ${unlocked ? "text-gray-800" : "text-gray-400"}`}>
                    {unlocked ? ach.name : "???"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {unlocked ? ach.description : "まだかいじょしていない"}
                  </p>
                  {unlocked && (
                    <div className="flex gap-3 mt-1.5 text-xs font-bold text-amber-600">
                      <span>🪙 +{ach.coinReward}</span>
                      <span>⭐ +{ach.xpReward} XP</span>
                    </div>
                  )}
                </div>
                {unlocked && (
                  <div className="text-green-500 text-xl font-bold">✓</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
