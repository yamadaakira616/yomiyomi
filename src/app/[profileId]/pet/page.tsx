"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { PROFILES, STORIES } from "@/data/stories";
import {
  PET_PROFILES,
  getPetStage,
  getNextPetStage,
  computeHappiness,
  getHappinessMood,
  HAPPINESS_MESSAGES,
} from "@/data/pet";
import { getProfileProgress } from "@/lib/progress";
import { playPetHappy, playCorrect } from "@/lib/sounds";

export default function PetPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";
  const profile = PROFILES.find((p) => p.id === profileId);
  const petProfile = PET_PROFILES[profileId];

  const [storiesCompleted, setStoriesCompleted] = useState(0);
  const [baseHappiness, setBaseHappiness] = useState(50);
  const [lastReadDate, setLastReadDate] = useState<string | undefined>();
  const [happiness, setHappiness] = useState(50);
  const [speechText, setSpeechText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [petTapCount, setPetTapCount] = useState(0);
  const messageIndexRef = useRef(0);

  useEffect(() => {
    const progress = getProfileProgress(profileId);
    const completed = Object.values(progress.stories).filter((s) => s.completed).length;
    setStoriesCompleted(completed);
    setBaseHappiness(progress.petHappiness ?? 50);
    setLastReadDate(progress.lastReadDate);
    const computed = computeHappiness(progress.lastReadDate, progress.petHappiness ?? 50);
    setHappiness(computed);
  }, [profileId]);

  useEffect(() => {
    // Show initial greeting after short delay
    const timer = setTimeout(() => {
      const mood = getHappinessMood(happiness);
      const messages = HAPPINESS_MESSAGES[mood];
      setSpeechText(messages[0]);
    }, 600);
    return () => clearTimeout(timer);
  }, [happiness]);

  if (!profile) {
    router.replace("/");
    return null;
  }

  const currentStage = getPetStage(profileId, storiesCompleted);
  const nextStage = getNextPetStage(profileId, storiesCompleted);
  const mood = getHappinessMood(happiness);
  const bgClass = profileId === "mushi" ? "from-green-50 to-emerald-100" : "from-pink-50 to-rose-100";

  const readsForNext = nextStage ? nextStage.minReads - storiesCompleted : 0;

  // Which emoji to show based on mood
  const petEmoji =
    mood === "happy"
      ? currentStage.happyEmoji
      : mood === "sad"
      ? currentStage.sadEmoji
      : currentStage.emoji;

  function handlePetTap() {
    if (isAnimating) return;
    setIsAnimating(true);
    playPetHappy();
    const newCount = petTapCount + 1;
    setPetTapCount(newCount);

    const mood = getHappinessMood(happiness);
    const messages = HAPPINESS_MESSAGES[mood];
    messageIndexRef.current = (messageIndexRef.current + 1) % messages.length;
    setSpeechText(messages[messageIndexRef.current]);

    if (newCount % 5 === 0) {
      playCorrect();
      setSpeechText("なでなでしてくれてありがとう！もっとなでて！💕");
    }

    setTimeout(() => setIsAnimating(false), 500);
  }

  const happinessColor =
    happiness >= 70 ? "from-green-400 to-emerald-500" :
    happiness >= 35 ? "from-yellow-400 to-amber-500" :
    "from-red-400 to-rose-500";

  const heartColors = ["❤️", "🧡", "💛", "💚", "💙", "💜"];

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgClass} pb-20`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} px-4 py-5 shadow-lg`}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 bg-white/20 rounded-full px-3 py-1"
            >
              ← もどる
            </button>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">🐾</div>
            <h1 className="text-2xl font-black text-white drop-shadow">{petProfile.petName}</h1>
            <p className="text-white/80 text-sm mt-0.5">
              {currentStage.name} · ステージ {currentStage.stage + 1} / {petProfile.stages.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Pet display */}
        <div className="bg-white rounded-3xl shadow-lg p-6 text-center relative overflow-hidden">
          {/* Mood particles */}
          {mood === "happy" && (
            <div className="absolute inset-0 pointer-events-none">
              {heartColors.slice(0, 4).map((heart, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl"
                  initial={{ opacity: 0, y: 0, x: Math.random() * 200 + 20 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -80,
                    x: Math.random() * 200 + 20,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                >
                  {heart}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pet emoji — tappable */}
          <motion.button
            onClick={handlePetTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            animate={
              isAnimating
                ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1.2, 1.1, 1] }
                : mood === "happy"
                ? { y: [0, -8, 0], transition: { repeat: Infinity, duration: 1.5 } }
                : mood === "sad"
                ? { rotate: [0, -3, 3, 0], transition: { repeat: Infinity, duration: 2 } }
                : {}
            }
            className="text-9xl block mx-auto mb-2 select-none cursor-pointer"
            aria-label="ペットをなでる"
          >
            {petEmoji}
          </motion.button>

          <p className="text-xs text-gray-400 mb-3">タップしてなでてあげよう！</p>

          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            {speechText && (
              <motion.div
                key={speechText}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 relative"
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-50 border-l-2 border-t-2 border-gray-100 rotate-45" />
                {speechText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Happiness meter */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-gray-700">💖 きもち</span>
            <span className="text-sm font-bold text-gray-500">{Math.round(happiness)} / 100</span>
          </div>
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${happiness}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${happinessColor}`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {mood === "happy" && "🌟 げんきいっぱい！毎日本を読んでくれてありがとう！"}
            {mood === "normal" && "📖 本を読んでくれるともっと嬉しくなるよ！"}
            {mood === "sad" && "😢 さびしいよ…本を読んでくれないと元気がなくなっちゃう"}
          </p>
          {lastReadDate && (
            <p className="text-xs text-gray-300 mt-1">
              最後に本を読んだ日: {lastReadDate}
            </p>
          )}
        </div>

        {/* Evolution progress */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm font-black text-gray-700 mb-3">🌱 せいちょう</h3>
          <div className="flex justify-between items-center gap-2">
            {petProfile.stages.map((stage, i) => {
              const reached = storiesCompleted >= stage.minReads;
              return (
                <div key={i} className="flex-1 text-center">
                  <motion.div
                    animate={reached && i === currentStage.stage ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className={`text-3xl mx-auto mb-1 ${reached ? "" : "grayscale opacity-40"}`}
                  >
                    {stage.emoji}
                  </motion.div>
                  <p className={`text-xs font-bold ${reached ? "text-gray-700" : "text-gray-300"}`}>
                    {stage.name}
                  </p>
                  {i < petProfile.stages.length - 1 && (
                    <div className={`h-0.5 mx-2 mt-2 rounded ${reached ? `bg-gradient-to-r ${profile.bgGradient}` : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {nextStage && (
            <div className={`mt-3 bg-gradient-to-r ${profile.bgGradient} rounded-xl p-3 text-center`}>
              <p className="text-white text-xs font-bold">
                あと {readsForNext} さつ読むと {nextStage.name} に進化！
              </p>
              <div className="bg-white/30 rounded-full h-2 mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, ((storiesCompleted - currentStage.minReads) / (nextStage.minReads - currentStage.minReads)) * 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          )}

          {!nextStage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 text-center"
            >
              <p className="text-yellow-700 font-black text-sm">🎉 さいこうのステージに到達！すごすぎる！！</p>
            </motion.div>
          )}
        </div>

        {/* Care tips */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm font-black text-gray-700 mb-3">🌟 そだてかた</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 text-sm">
              <span className="text-xl">📖</span>
              <div>
                <p className="font-bold text-gray-700">本を読む</p>
                <p className="text-gray-400 text-xs">読むときもちが +20 あがる</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-bold text-gray-700">クイズ全問正解</p>
                <p className="text-gray-400 text-xs">パーフェクトで +30 アップ</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-xl">😴</span>
              <div>
                <p className="font-bold text-gray-700">読まない日が続くと…</p>
                <p className="text-gray-400 text-xs">1日で -15 ずつ減ってしまう</p>
              </div>
            </div>
          </div>
        </div>

        {/* Go read button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/${profileId}`)}
          className={`w-full bg-gradient-to-r ${profile.bgGradient} text-white font-black text-lg rounded-2xl py-4 shadow-lg`}
        >
          📖 本を読みに行く！
        </motion.button>
      </div>
    </main>
  );
}
