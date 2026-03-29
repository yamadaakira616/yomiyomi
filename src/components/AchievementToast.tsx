"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useEffect } from "react";

type Props = {
  achievementIds: string[];
  onDismiss: () => void;
};

export default function AchievementToast({ achievementIds, onDismiss }: Props) {
  const achievements = achievementIds
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean);

  useEffect(() => {
    if (achievements.length === 0) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [achievements.length, onDismiss]);

  if (achievements.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      <AnimatePresence>
        {achievements.map((ach) => (
          <motion.div
            key={ach!.id}
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onDismiss}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-4 cursor-pointer border-2 border-yellow-300"
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl flex-shrink-0"
            >
              {ach!.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-yellow-900/70 uppercase tracking-wide">
                🏆 じっせき かいじょ！
              </p>
              <p className="font-black text-yellow-900 truncate">{ach!.name}</p>
              <p className="text-xs text-yellow-800/80 truncate">{ach!.description}</p>
              <div className="flex gap-2 mt-1 text-xs font-bold text-yellow-900">
                <span>🪙 +{ach!.coinReward}</span>
                <span>⭐ +{ach!.xpReward}XP</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
