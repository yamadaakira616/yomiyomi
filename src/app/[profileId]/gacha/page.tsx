"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PROFILES } from "@/data/stories";
import {
  GACHA_CHARACTERS,
  PULL_COST,
  RARITY_LABELS,
  RARITY_BG,
  RARITY_COLORS,
  pullGacha,
  type GachaPullResult,
} from "@/data/gacha";
import { getProfileProgress, spendCoinsForGacha } from "@/lib/progress";
import { useEffect, useState } from "react";
import GachaAnimation from "@/components/GachaAnimation";
import Confetti from "@/components/Confetti";

export default function GachaPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";
  const profile = PROFILES.find((p) => p.id === profileId);

  const [coins, setCoins] = useState(0);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [pulling, setPulling] = useState(false);
  const [result, setResult] = useState<GachaPullResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const profileChars = GACHA_CHARACTERS.filter((c) => c.profileId === profileId);

  useEffect(() => {
    const p = getProfileProgress(profileId);
    setCoins(p.coins || 0);
    setOwnedIds(p.gachaCharacters || []);
  }, [profileId]);

  if (!profile) {
    router.replace("/");
    return null;
  }

  const canPull = coins >= PULL_COST && ownedIds.length < profileChars.length;
  const allOwned = ownedIds.length >= profileChars.length;

  const handlePull = () => {
    if (!canPull || pulling) return;
    setPulling(true);

    const pullResult = pullGacha(profileId, ownedIds);
    if (!pullResult) {
      setPulling(false);
      return;
    }

    const success = spendCoinsForGacha(profileId, PULL_COST, pullResult.character.id);
    if (!success) {
      setPulling(false);
      return;
    }

    const updatedProgress = getProfileProgress(profileId);
    setCoins(updatedProgress.coins);
    setOwnedIds(updatedProgress.gachaCharacters || []);

    setResult(pullResult);
    setShowAnimation(true);

    if (pullResult.character.rarity === 3) {
      setTimeout(() => setConfetti(true), 600);
      setTimeout(() => setConfetti(false), 3500);
    }
    setPulling(false);
  };

  const bgClass = profileId === "mushi" ? "from-green-50 to-emerald-100" : "from-pink-50 to-rose-100";

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgClass} pb-20`}>
      <Confetti active={confetti} />

      {showAnimation && result && (
        <GachaAnimation
          character={result.character}
          onClose={() => setShowAnimation(false)}
        />
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} px-4 py-5 shadow-lg`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 bg-white/20 rounded-full px-3 py-1"
            >
              ← もどる
            </button>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <span className="text-xl">🪙</span>
              <span className="text-white font-black text-lg">{coins}</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-1"
            >
              🎰
            </motion.div>
            <h1 className="text-2xl font-black text-white drop-shadow">キャラガチャ</h1>
            <p className="text-white/80 text-sm mt-1">
              {ownedIds.length} / {profileChars.length} キャラゲット！
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Pull button */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-center">
          {allOwned ? (
            <div>
              <div className="text-5xl mb-3">🎊</div>
              <p className="font-black text-xl text-gray-800">ぜんキャラコンプリート！！</p>
              <p className="text-gray-500 text-sm mt-2">すべてのキャラをあつめました！すごすぎる！</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-3 mb-4 text-sm">
                <span className="text-gray-500">
                  あと {profileChars.length - ownedIds.length} キャラ
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  コスト: 🪙 {PULL_COST}
                </span>
              </div>

              {/* Rarity odds display */}
              <div className="flex justify-center gap-3 mb-5 text-xs">
                <span className="text-gray-400">★ 70%</span>
                <span className="text-blue-500 font-semibold">★★ 25%</span>
                <span className="text-yellow-600 font-bold">★★★ 5%</span>
              </div>

              <motion.button
                whileHover={canPull ? { scale: 1.04 } : {}}
                whileTap={canPull ? { scale: 0.97 } : {}}
                onClick={handlePull}
                disabled={!canPull || pulling}
                className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-lg transition-all
                  ${canPull
                    ? `bg-gradient-to-r ${profile.bgGradient} hover:shadow-xl`
                    : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {pulling ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="inline-block"
                  >
                    🎰
                  </motion.span>
                ) : canPull ? (
                  `🎰 ガチャをひく！ 🪙 ${PULL_COST}`
                ) : (
                  `コインが足りない… (あと ${PULL_COST - coins} コイン)`
                )}
              </motion.button>

              {!canPull && (
                <p className="text-xs text-gray-400 mt-3">
                  おはなしをよんでコインをためよう！
                </p>
              )}
            </>
          )}
        </div>

        {/* Character collection */}
        <h2 className="text-sm font-bold text-gray-500 mb-3 px-1">
          キャラクターアルバム
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {profileChars.map((char, index) => {
            const owned = ownedIds.includes(char.id);
            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 }}
                className={`rounded-3xl p-4 text-center border-2 ${
                  owned ? RARITY_BG[char.rarity] : "bg-gray-100 border-dashed border-gray-300"
                }`}
              >
                {owned ? (
                  <>
                    <div
                      className={`mb-2 p-2 rounded-full inline-flex items-center justify-center ${char.bgColor.startsWith("#") ? "" : `bg-gradient-to-br ${char.bgColor}`}`}
                      style={char.bgColor.startsWith("#") ? { background: char.bgColor } : {}}
                    >
                      {char.imagePath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={char.imagePath}
                          alt={char.name}
                          width={56}
                          height={56}
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <span className="text-5xl">{char.emoji}</span>
                      )}
                    </div>
                    <p className={`text-sm font-black ${RARITY_COLORS[char.rarity]}`}>
                      {RARITY_LABELS[char.rarity]}
                    </p>
                    <p className="text-xs font-bold text-gray-700 mt-1">{char.name}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{char.description}</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-2 opacity-20 grayscale">❓</div>
                    <p className={`text-xs font-bold ${RARITY_COLORS[char.rarity]}`}>
                      {RARITY_LABELS[char.rarity]}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">???</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* How to earn coins guide */}
        <div className="mt-6 bg-white rounded-2xl shadow p-5">
          <h3 className="font-black text-gray-700 text-sm mb-3">🪙 コインのかせぎかた</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>📖 おはなしをよむ（はじめて）</span>
              <span className="font-bold text-amber-600">+50コイン</span>
            </div>
            <div className="flex justify-between">
              <span>✅ クイズにせいかい（1問）</span>
              <span className="font-bold text-amber-600">+15コイン</span>
            </div>
            <div className="flex justify-between">
              <span>🎯 クイズかんぺきせいかい！</span>
              <span className="font-bold text-amber-600">+50コイン（ボーナス）</span>
            </div>
            <div className="flex justify-between">
              <span>💭 かんがえるもんだいにこたえる</span>
              <span className="font-bold text-amber-600">+20コイン</span>
            </div>
            <div className="flex justify-between">
              <span>🔥 れんぞくよみボーナス</span>
              <span className="font-bold text-amber-600">+30コイン/日</span>
            </div>
            <div className="flex justify-between">
              <span>🏆 じっせきかいじょ</span>
              <span className="font-bold text-amber-600">+100〜1000コイン</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
