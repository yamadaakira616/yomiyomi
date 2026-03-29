"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PROFILES, STORIES } from "@/data/stories";
import { getEarnedStickers, getTotalStars, resetProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export default function CollectionPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";

  const profile = PROFILES.find((p) => p.id === profileId);
  const profileStories = STORIES.filter((s) => s.profileId === profileId);

  const [earnedIds, setEarnedIds] = useState<string[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setEarnedIds(getEarnedStickers(profileId));
    setTotalStars(getTotalStars(profileId));
  }, [profileId]);

  if (!profile) {
    router.replace("/");
    return null;
  }

  const handleReset = () => {
    resetProgress(profileId);
    setEarnedIds([]);
    setTotalStars(0);
    setShowReset(false);
  };

  const bgClass = profileId === "mushi"
    ? "from-green-50 to-emerald-100"
    : "from-pink-50 to-rose-100";

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgClass} pb-20`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} px-4 py-5 shadow-lg`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 bg-white/20 rounded-full px-3 py-1"
            >
              ← もどる
            </button>
            <button
              onClick={() => setShowReset(!showReset)}
              className="text-white/50 hover:text-white/80 text-xs"
            >
              ⚙️
            </button>
          </div>
          <div className="text-center mt-2">
            <div className="text-5xl mb-1">{profile.emoji}</div>
            <h1 className="text-2xl font-black text-white drop-shadow">
              {profile.stickerLabel}コレクション
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-white/90 text-sm font-semibold">
                ⭐ {totalStars} こ
              </span>
              <span className="text-white/60 text-xs">
                ({earnedIds.length} / {profileStories.length} シール)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Reset option */}
        {showReset && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-center"
          >
            <p className="text-red-700 text-sm font-semibold mb-3">
              きろくをリセットしますか？シールもぜんぶなくなります。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-bold"
              >
                リセットする
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-bold"
              >
                やめる
              </button>
            </div>
          </motion.div>
        )}

        {/* All-clear banner */}
        {earnedIds.length === profileStories.length && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mb-6 bg-gradient-to-r ${profile.bgGradient} rounded-3xl p-5 text-center shadow-lg`}
          >
            <div className="text-5xl mb-2">🏆</div>
            <p className="text-white font-black text-xl drop-shadow">
              ぜんぶコンプリート！！
            </p>
            <p className="text-white/80 text-sm mt-1">
              すべてのシールをあつめました！
            </p>
          </motion.div>
        )}

        {/* Progress summary */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-400 mb-3">コレクション進行ちゅう</h2>
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-black ${profile.textColor}`}>
              {earnedIds.length}
              <span className="text-lg text-gray-400"> / {profileStories.length}</span>
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedIds.length / profileStories.length) * 100}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${profile.bgGradient}`}
              />
            </div>
          </div>
        </div>

        {/* Sticker grid */}
        <h2 className="text-sm font-bold text-gray-500 mb-3 px-1">
          シールアルバム {earnedIds.length === 0 ? "（まだシールがありません）" : ""}
        </h2>

        {earnedIds.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-20">🌟</div>
            <p className="text-gray-400 text-sm">
              おはなしをよんでシールをゲットしよう！
            </p>
            <button
              onClick={() => router.push(`/${profileId}`)}
              className={`mt-4 px-6 py-3 rounded-full text-white font-bold shadow-lg bg-gradient-to-r ${profile.bgGradient}`}
            >
              おはなしをよむ →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profileStories.map((story, index) => {
              const earned = earnedIds.includes(story.id);
              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.07 }}
                  className={`
                    rounded-3xl p-5 text-center shadow transition-all
                    ${earned
                      ? `${story.color} border-2 border-current`
                      : "bg-gray-100 border-2 border-dashed border-gray-300"
                    }
                  `}
                >
                  <div className={`text-5xl mb-2 ${!earned && "grayscale opacity-30"}`}>
                    {earned ? story.stickerEmoji : "❓"}
                  </div>
                  {earned ? (
                    <>
                      <p className="text-xs font-black text-gray-700">
                        {story.stickerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-tight">
                        {story.title}
                      </p>
                      <div className="mt-2 text-yellow-500 text-sm">⭐</div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-400 font-semibold">
                        第{index + 1}話をよもう
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        {story.title}
                      </p>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Go read more */}
        {earnedIds.length > 0 && earnedIds.length < profileStories.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm mb-3">
              あと {profileStories.length - earnedIds.length} 枚でコンプリート！
            </p>
            <button
              onClick={() => router.push(`/${profileId}`)}
              className={`px-6 py-3 rounded-full text-white font-bold shadow-lg bg-gradient-to-r ${profile.bgGradient}`}
            >
              つづきをよむ →
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
