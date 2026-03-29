"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PROFILES } from "@/data/stories";
import { getProfileProgress, getTotalStars } from "@/lib/progress";
import { getLevelFromXp } from "@/data/achievements";
import { useEffect, useState } from "react";

type ProfileStats = {
  stars: number;
  coins: number;
  streak: number;
  level: { name: string; emoji: string };
};

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, ProfileStats>>({});

  useEffect(() => {
    const s: Record<string, ProfileStats> = {};
    PROFILES.forEach((p) => {
      const progress = getProfileProgress(p.id);
      s[p.id] = {
        stars: getTotalStars(p.id),
        coins: progress.coins || 0,
        streak: progress.streak || 0,
        level: getLevelFromXp(progress.xp || 0),
      };
    });
    setStats(s);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-100 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-7xl mb-3"
        >
          📚
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-indigo-800 drop-shadow-sm tracking-tight">
          よんよん探検隊
        </h1>
        <p className="text-lg text-indigo-600 mt-2 font-medium">
          読んで、考えて、強くなろう！
        </p>
      </motion.div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {PROFILES.map((profile, index) => {
          const s = stats[profile.id];
          return (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/${profile.id}`)}
              className={`
                relative overflow-hidden rounded-3xl shadow-xl cursor-pointer text-left
                bg-gradient-to-br ${profile.bgGradient}
                p-7 min-h-[240px] flex flex-col justify-between
                border-4 border-white/30
              `}
            >
              {/* Decorative BG emoji */}
              <div className="absolute top-0 right-0 text-9xl opacity-10 -rotate-12 select-none pointer-events-none">
                {profile.emoji}
              </div>

              {/* Top stats row */}
              {s && (s.streak > 0 || s.coins > 0) && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {s.streak > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/25 backdrop-blur-sm text-white text-xs font-bold rounded-full px-2 py-0.5 flex items-center gap-1"
                    >
                      🔥 {s.streak}日れんぞく
                    </motion.span>
                  )}
                  {s.coins > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/25 backdrop-blur-sm text-white text-xs font-bold rounded-full px-2 py-0.5 flex items-center gap-1"
                    >
                      🪙 {s.coins}
                    </motion.span>
                  )}
                </div>
              )}

              {/* Main content */}
              <div>
                <div className="text-6xl mb-3">{profile.emoji}</div>
                <h2 className="text-2xl font-black text-white drop-shadow mb-1">
                  {profile.name}
                </h2>
                <p className="text-white/90 text-sm font-semibold">{profile.grade}</p>
              </div>

              {/* Level & progress */}
              <div className="mt-4">
                {s && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{s.level.emoji}</span>
                    <span className="text-white/90 text-sm font-bold">{s.level.name}</span>
                    {s.stars > 0 && (
                      <span className="text-yellow-200 text-sm font-bold ml-auto">
                        ⭐ {s.stars}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-white/80 text-sm mb-3">{profile.description}</p>
                <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-bold">
                  <span>スタート！</span>
                  <span>→</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-indigo-400 text-sm"
      >
        どちらのキャラクターかな？タップしてはじめよう！
      </motion.p>
    </main>
  );
}
