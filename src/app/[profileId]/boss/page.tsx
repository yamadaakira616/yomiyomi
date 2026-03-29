"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { PROFILES, STORIES, type QuizQuestion } from "@/data/stories";
import { getProfileProgress, addReward } from "@/lib/progress";
import { playCorrect, playWrong, playBossHit, playVictory, playPlayerHit, playTick, playCoin } from "@/lib/sounds";
import Confetti from "@/components/Confetti";

const QUESTION_TIME = 10; // seconds per question
const PLAYER_MAX_HP = 3;

type BossConfig = {
  name: string;
  emoji: string;
  hitEmoji: string;
  color: string;
  gradient: string;
};

const BOSS_BY_PROFILE: Record<"mushi" | "stamp", BossConfig> = {
  mushi: {
    name: "カブトムシ大王",
    emoji: "🦗",
    hitEmoji: "💥",
    color: "from-green-600 to-emerald-700",
    gradient: "from-green-500 to-teal-600",
  },
  stamp: {
    name: "まほうつかい",
    emoji: "🧙‍♀️",
    hitEmoji: "✨",
    color: "from-pink-600 to-rose-700",
    gradient: "from-pink-500 to-rose-600",
  },
};

type GameState = "intro" | "battle" | "victory" | "defeat";

export default function BossPage() {
  const params = useParams<{ profileId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";
  const profile = PROFILES.find((p) => p.id === profileId);
  const boss = BOSS_BY_PROFILE[profileId];

  // Build question pool from ALL stories in this profile
  const allQuestions = useRef<QuizQuestion[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameState, setGameState] = useState<GameState>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // HP state
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = useState(10);
  const [bossMaxHp] = useState(10);
  const [bossHit, setBossHit] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);

  // Score
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [rewards, setRewards] = useState({ coins: 0, xp: 0 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if boss mode is unlocked (need at least 1 story completed)
  const [isUnlocked, setIsUnlocked] = useState(false);
  useEffect(() => {
    const progress = getProfileProgress(profileId);
    const completed = Object.values(progress.stories).filter((s) => s.completed).length;
    setIsUnlocked(completed >= 1);
  }, [profileId]);

  // Build question pool
  useEffect(() => {
    const stories = STORIES.filter((s) => s.profileId === profileId);
    const pool: QuizQuestion[] = [];
    for (const story of stories) {
      for (const q of story.quiz) {
        if (q.type !== "inference") pool.push(q); // only answerable questions
      }
    }
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    allQuestions.current = shuffled;
    setQuestions(shuffled.slice(0, Math.min(10, shuffled.length)));
  }, [profileId]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return 0;
        }
        if (t <= 4) playTick();
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Time out — treat as wrong
  useEffect(() => {
    if (timeLeft === 0 && gameState === "battle" && !showFeedback) {
      handleAnswer(-1); // -1 = timeout
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState, showFeedback]);

  function startBattle() {
    setGameState("battle");
    setQIndex(0);
    setPlayerHp(PLAYER_MAX_HP);
    setBossHp(bossMaxHp);
    setScore(0);
    setCorrectStreak(0);
    setMaxStreak(0);
    startTimer();
  }

  function handleAnswer(optionIndex: number) {
    if (showFeedback) return;
    stopTimer();
    setSelected(optionIndex);
    setShowFeedback(true);

    const question = questions[qIndex];
    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      playBossHit();
      setBossHit(true);
      const streakBonus = Math.floor(correctStreak / 3) * 5; // combo bonus
      const pts = 10 + streakBonus;
      setScore((s) => s + pts);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      setBossHp((hp) => Math.max(0, hp - 1));
      setTimeout(() => setBossHit(false), 600);
    } else {
      playWrong();
      setPlayerHit(true);
      setPlayerHp((hp) => Math.max(0, hp - 1));
      setCorrectStreak(0);
      setTimeout(() => {
        playPlayerHit();
        setPlayerHit(false);
      }, 600);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      const nextIndex = qIndex + 1;

      // Check win/lose conditions
      const newBossHp = isCorrect ? bossHp - 1 : bossHp;
      const newPlayerHp = isCorrect ? playerHp : playerHp - 1;

      if (newBossHp <= 0) {
        endBattle("victory", score + (isCorrect ? 10 : 0));
        return;
      }
      if (newPlayerHp <= 0) {
        endBattle("defeat", score);
        return;
      }
      if (nextIndex >= questions.length) {
        // All questions answered — decide by HP
        endBattle(newBossHp <= newPlayerHp ? "victory" : "defeat", score + (isCorrect ? 10 : 0));
        return;
      }
      setQIndex(nextIndex);
      startTimer();
    }, 1800);
  }

  function endBattle(result: "victory" | "defeat", finalScore: number) {
    stopTimer();
    setGameState(result);
    if (result === "victory") {
      playVictory();
      setConfetti(true);
      playCoin();
      const bonusCoins = finalScore + maxStreak * 10 + 100;
      const bonusXp = Math.floor(finalScore * 0.5) + 50;
      setRewards({ coins: bonusCoins, xp: bonusXp });
      addReward(profileId, bonusCoins, bonusXp);
    }
  }

  if (!profile) {
    router.replace("/");
    return null;
  }

  const bgClass = profileId === "mushi" ? "from-gray-900 to-emerald-950" : "from-gray-900 to-pink-950";
  const currentQ = questions[qIndex];

  if (!isUnlocked) {
    return (
      <main className={`min-h-screen bg-gradient-to-b ${bgClass} flex flex-col items-center justify-center p-6`}>
        <div className="text-center space-y-4">
          <div className="text-8xl">🔒</div>
          <h1 className="text-2xl font-black text-white">ボスバトル</h1>
          <p className="text-gray-300">本を1さつよむとかいじょできるよ！</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${profileId}`)}
            className="bg-white text-gray-800 font-black rounded-2xl px-8 py-3"
          >
            ← もどる
          </motion.button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgClass} pb-10`}>
      {confetti && <Confetti active={confetti} />}

      {/* Intro screen */}
      {gameState === "intro" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-9xl mb-4"
          >
            {boss.emoji}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white mb-2"
          >
            ⚔️ ボスバトル ⚔️
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mb-2 text-lg font-bold"
          >
            {boss.name} があらわれた！
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm mb-6"
          >
            クイズに答えてボスをたおせ！<br />
            {QUESTION_TIME}秒以内に答えよう！ 3回まちがえたらゲームオーバー
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3 w-full max-w-xs"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startBattle}
              className={`w-full bg-gradient-to-r ${boss.gradient} text-white font-black text-xl rounded-2xl py-4 shadow-lg`}
            >
              ⚔️ バトル開始！
            </motion.button>
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="w-full text-gray-500 text-sm py-2"
            >
              もどる
            </button>
          </motion.div>
        </div>
      )}

      {/* Battle screen */}
      {gameState === "battle" && currentQ && (
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {/* HP bars */}
          <div className="grid grid-cols-2 gap-3">
            {/* Player HP */}
            <div className={`bg-black/30 rounded-xl p-3 ${playerHit ? "border-2 border-red-500" : ""}`}>
              <p className="text-xs text-gray-400 font-bold mb-1">🧒 じぶん</p>
              <div className="flex gap-1">
                {Array.from({ length: PLAYER_MAX_HP }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={i === playerHp && playerHit ? { scale: [1, 1.5, 0] } : {}}
                    className={`text-xl ${i < playerHp ? "opacity-100" : "opacity-20"}`}
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Boss HP */}
            <div className={`bg-black/30 rounded-xl p-3 ${bossHit ? "border-2 border-yellow-400" : ""}`}>
              <p className="text-xs text-gray-400 font-bold mb-1">{boss.emoji} {boss.name}</p>
              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{bossHp} / {bossMaxHp}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">問題 {qIndex + 1} / {questions.length}</span>
            <motion.div
              animate={timeLeft <= 3 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className={`font-black text-2xl ${timeLeft <= 3 ? "text-red-400" : "text-white"}`}
            >
              ⏱ {timeLeft}
            </motion.div>
            <span className="text-yellow-400 font-bold text-sm">スコア {score}</span>
          </div>

          {/* Timer bar */}
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${timeLeft <= 3 ? "bg-red-500" : "bg-blue-400"}`}
            />
          </div>

          {/* Question */}
          <div className="bg-black/40 rounded-2xl p-4">
            <p className="text-white font-bold text-base leading-relaxed">{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, i) => {
              let btnClass = "bg-gray-800 border-gray-700 text-gray-100";
              if (showFeedback && selected !== null) {
                if (i === currentQ.correctIndex) btnClass = "bg-green-700 border-green-500 text-white";
                else if (i === selected && i !== currentQ.correctIndex) btnClass = "bg-red-700 border-red-500 text-white";
              }
              return (
                <motion.button
                  key={i}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  onClick={() => !showFeedback && handleAnswer(i)}
                  disabled={showFeedback}
                  className={`w-full rounded-xl border-2 p-3 text-left font-bold transition-all ${btnClass}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Combo display */}
          {correctStreak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center text-yellow-400 font-black text-lg"
            >
              🔥 {correctStreak} 連続正解！コンボボーナス！
            </motion.div>
          )}

          {/* Boss hit animation overlay */}
          <AnimatePresence>
            {bossHit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1.5, y: -50 }}
                exit={{ opacity: 0 }}
                className="fixed top-1/3 left-1/2 -translate-x-1/2 text-5xl pointer-events-none z-50"
              >
                {boss.hitEmoji}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Victory screen */}
      {gameState === "victory" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-9xl mb-4"
          >
            🏆
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white mb-2"
          >
            ボスたおした！！
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-yellow-300 text-xl font-bold mb-1"
          >
            スコア: {score}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-sm mb-6"
          >
            最高コンボ: {maxStreak}連続 🔥
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 rounded-2xl p-4 mb-6 text-center w-full max-w-xs"
          >
            <p className="text-yellow-300 font-black text-lg">🪙 +{rewards.coins} コイン</p>
            <p className="text-blue-300 font-black text-lg">⭐ +{rewards.xp} XP</p>
          </motion.div>
          <div className="space-y-3 w-full max-w-xs">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setGameState("intro")}
              className={`w-full bg-gradient-to-r ${boss.gradient} text-white font-black text-lg rounded-2xl py-4`}
            >
              もう一度！
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/${profileId}`)}
              className="w-full bg-white/10 text-white font-bold rounded-2xl py-3"
            >
              もどる
            </motion.button>
          </div>
        </div>
      )}

      {/* Defeat screen */}
      {gameState === "defeat" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-9xl mb-4"
          >
            💀
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">やられた…</h1>
          <p className="text-gray-400 text-sm mb-2">スコア: {score}</p>
          <p className="text-gray-500 text-sm mb-8">
            本をよんでもっと強くなって<br />またちょうせんしよう！
          </p>
          <div className="space-y-3 w-full max-w-xs">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setGameState("intro")}
              className={`w-full bg-gradient-to-r ${boss.gradient} text-white font-black text-lg rounded-2xl py-4`}
            >
              リベンジ！
            </motion.button>
            <button
              onClick={() => router.push(`/${profileId}`)}
              className="w-full text-gray-500 py-2 text-sm"
            >
              もどる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
