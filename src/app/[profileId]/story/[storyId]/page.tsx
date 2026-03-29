"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PROFILES, STORIES, type StoryPage } from "@/data/stories";
import { markStoryComplete, isStoryCompleted, addReward } from "@/lib/progress";
import { ACHIEVEMENTS } from "@/data/achievements";
import { speak, stop } from "@/lib/tts";
import { playCorrect, playWrong, playPageTurn, playVictory, playCoin, playLevelUp } from "@/lib/sounds";
import { incrementQuestProgress } from "@/lib/dailyQuest";
import { useEffect, useState, useRef } from "react";
import Confetti from "@/components/Confetti";
import AchievementToast from "@/components/AchievementToast";

type AppState = "reading" | "choice" | "quiz" | "reward";

export default function StoryPage() {
  const params = useParams<{ profileId: string; storyId: string }>();
  const router = useRouter();
  const profileId = params.profileId as "mushi" | "stamp";
  const storyId = params.storyId;

  const profile = PROFILES.find((p) => p.id === profileId);
  const story = STORIES.find((s) => s.id === storyId);

  const [appState, setAppState] = useState<AppState>("reading");
  const [pageIndex, setPageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [choiceInsertPage, setChoiceInsertPage] = useState<StoryPage | null>(null); // selected branch page
  const [choiceMade, setChoiceMade] = useState(false);
  // Voice reading state
  const [isListening, setIsListening] = useState(false);
  const [voiceScore, setVoiceScore] = useState<number | null>(null); // 0-100
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [inferencesAnswered, setInferencesAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<boolean[]>([]); // track each answer

  // Reward state
  const [stickerPopped, setStickerPopped] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [rewardSummary, setRewardSummary] = useState<{
    coinsEarned: number;
    xpEarned: number;
    newAchievements: string[];
    isFirstTime: boolean;
    streakBonus: number;
  } | null>(null);
  const [achievementDismissed, setAchievementDismissed] = useState(false);
  const [alreadyDone] = useState(() =>
    story ? isStoryCompleted(profileId, story.id) : false
  );

  useEffect(() => {
    return () => stop();
  }, []);

  if (!profile || !story) {
    router.replace(`/${profileId}`);
    return null;
  }

  // If we have a choice insert page to show, use that; otherwise use normal page
  const currentPage = choiceInsertPage ?? story.pages[pageIndex];
  const totalPages = story.pages.length;
  // isLastPage: showing insert = never last; at real last page with no insert pending
  const isLastPage = !choiceInsertPage && pageIndex === totalPages - 1;
  const currentQuestion = story.quiz[quizIndex];

  // Non-inference questions count
  const nonInferenceTotal = story.quiz.filter((q) => q.type !== "inference").length;

  // ──────────────────── TTS ────────────────────
  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(currentPage.text, () => setIsSpeaking(false));
    }
  };

  // ──────────────────── Reading ────────────────────
  const handleNextPage = () => {
    stop();
    setIsSpeaking(false);
    setVoiceScore(null);
    recRef.current?.stop();
    setIsListening(false);
    playPageTurn();

    // Check if a choice point triggers after this page
    const cp = story.choicePoint;
    if (cp && !choiceMade && pageIndex === cp.afterPage) {
      setAppState("choice");
      return;
    }
    // If we're showing the branch insert page, advance past it
    if (choiceInsertPage && appState === "reading") {
      setChoiceInsertPage(null);
      setPageIndex((i) => i + 1);
      return;
    }

    if (isLastPage) {
      setAppState("quiz");
    } else {
      setPageIndex((i) => i + 1);
    }
  };

  const handleChoiceSelect = (optionIndex: number) => {
    if (!story.choicePoint) return;
    playCorrect();
    setChoiceMade(true);
    setChoiceInsertPage(story.choicePoint.options[optionIndex].resultPage);
    setAppState("reading");
  };

  // ──────────────────── Voice Reading ────────────────────
  const handleVoiceRead = () => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recRef.current?.stop();
      setIsListening(false);
      return;
    }

    setVoiceScore(null);
    setIsListening(true);
    const rec = new SR();
    recRef.current = rec;
    rec.lang = "ja-JP";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      // Compute character-level overlap (Japanese — no spaces, just chars)
      const normalize = (s: string) => s.replace(/[\s\n　。、！？「」『』…・]/g, "");
      const target = normalize(currentPage.text);
      const got = normalize(spoken);
      let matched = 0;
      let ti = 0;
      for (let gi = 0; gi < got.length && ti < target.length; gi++) {
        if (got[gi] === target[ti]) { matched++; ti++; }
      }
      const score = Math.min(100, Math.round((matched / Math.max(target.length, 1)) * 100));
      setVoiceScore(score);
      setIsListening(false);
      if (score >= 60) playCorrect();
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handlePrevPage = () => {
    stop();
    setIsSpeaking(false);
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  };

  // ──────────────────── Quiz ────────────────────
  const handleSelectOption = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);

    const isInference = currentQuestion.type === "inference";
    const isCorrect = isInference || index === currentQuestion.correctIndex;

    if (isInference) {
      setInferencesAnswered((c) => c + 1);
      playCorrect();
    } else if (isCorrect) {
      setCorrectCount((c) => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
    setAnswerLog((log) => [...log, isCorrect]);

    const delay = isInference ? 1200 : 1600;
    setTimeout(() => {
      if (quizIndex < story.quiz.length - 1) {
        setQuizIndex((i) => i + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // All questions done — calculate final
        const finalCorrect = isInference ? correctCount : isCorrect ? correctCount + 1 : correctCount;
        const finalInferences = isInference ? inferencesAnswered + 1 : inferencesAnswered;

        const summary = markStoryComplete(
          profileId,
          storyId,
          finalCorrect,
          nonInferenceTotal,
          finalInferences
        );
        // Daily quest tracking — apply rewards if quest just completed
        const readReward = incrementQuestProgress(profileId, "read");
        if (readReward.justCompleted) addReward(profileId, readReward.coinReward, readReward.xpReward);

        if (finalInferences > 0) {
          const infReward = incrementQuestProgress(profileId, "inference", finalInferences);
          if (infReward.justCompleted) addReward(profileId, infReward.coinReward, infReward.xpReward);
        }

        const isPerfect = finalCorrect === nonInferenceTotal && nonInferenceTotal > 0;
        if (isPerfect) {
          const perfectReward = incrementQuestProgress(profileId, "perfect_quiz");
          if (perfectReward.justCompleted) addReward(profileId, perfectReward.coinReward, perfectReward.xpReward);
        }
        setRewardSummary(summary);
        setAppState("reward");
        playCoin();
        setTimeout(() => {
          setStickerPopped(true);
          setConfetti(true);
          playVictory();
          if (summary.newAchievements.length > 0) setTimeout(() => playLevelUp(), 800);
          setTimeout(() => setConfetti(false), 3000);
        }, 400);
      }
    }, delay);
  };

  // ──────────────────── Helpers ────────────────────
  const getAchievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id);

  const bgGradient = profileId === "mushi" ? "from-green-50 to-emerald-100" : "from-pink-50 to-rose-100";

  return (
    <main className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col`}>
      <Confetti active={confetti} />

      {/* Achievement toast */}
      {rewardSummary && !achievementDismissed && rewardSummary.newAchievements.length > 0 && (
        <AchievementToast
          achievementIds={rewardSummary.newAchievements}
          onDismiss={() => setAchievementDismissed(true)}
        />
      )}

      {/* Top bar */}
      <div className={`bg-gradient-to-r ${profile.bgGradient} px-4 py-3 flex items-center justify-between shadow`}>
        <button
          onClick={() => { stop(); router.push(`/${profileId}`); }}
          className="text-white/80 hover:text-white flex items-center gap-1 text-sm bg-white/20 rounded-full px-3 py-1"
        >
          ← もどる
        </button>
        <span className="text-white font-bold text-sm truncate max-w-[140px]">
          {story.title}
        </span>
        <div className="text-white/80 text-xs font-medium bg-white/20 rounded-full px-2 py-0.5">
          {appState === "reading" ? `${pageIndex + 1}/${totalPages}p` : appState === "choice" ? "🤔えらんで！" : appState === "quiz" ? `Q${quizIndex + 1}/${story.quiz.length}` : ""}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════ READING STATE ═══════════════════ */}
        {appState === "reading" && (
          <motion.div
            key={`page-${pageIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-5"
          >
            {/* Page dots */}
            <div className="flex gap-2 justify-center mb-5">
              {story.pages.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === pageIndex ? `${profile.accentColor} scale-125` : i < pageIndex ? "bg-gray-400" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Story card */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col gap-5">
              <div className="text-center">
                <motion.div
                  key={currentPage.emoji}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl md:text-8xl"
                >
                  {currentPage.emoji}
                </motion.div>
              </div>
              <div className="flex-1">
                <p className="reading-text text-gray-800 whitespace-pre-line text-center leading-loose">
                  {currentPage.text}
                </p>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={handleSpeak}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow transition-all
                    ${isSpeaking ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {isSpeaking ? "🔊 よみあげちゅう…" : "🔈 よみあげる"}
                </button>
                <button
                  onClick={handleVoiceRead}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow transition-all
                    ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                >
                  {isListening ? "🎤 きいてるよ…" : "🎤 よんでみよう！"}
                </button>
              </div>
              {/* Voice score display */}
              {voiceScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <p className="font-black text-gray-700 text-sm">
                    {voiceScore >= 80 ? "🌟🌟🌟 かんぺき！！" :
                     voiceScore >= 60 ? "🌟🌟 じょうず！" :
                     voiceScore >= 40 ? "🌟 もう少し！" : "😊 もう一度！"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">よめた文字: {voiceScore}%</p>
                </motion.div>
              )}
            </div>

            {/* Reward preview */}
            <div className="flex justify-center gap-4 my-3 text-xs text-gray-400">
              <span>🪙 +{story.readCoins}</span>
              <span>⭐ +{story.readXp} XP</span>
            </div>

            <div className="flex gap-3">
              {pageIndex > 0 && (
                <button
                  onClick={handlePrevPage}
                  className="flex-1 py-3 rounded-2xl bg-white text-gray-600 font-bold shadow hover:shadow-md transition-all border border-gray-200"
                >
                  ← まえへ
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextPage}
                className={`flex-1 py-4 rounded-2xl text-white font-black text-lg shadow-lg bg-gradient-to-r ${profile.bgGradient}`}
              >
                {isLastPage ? "クイズへ！🎯" : "つぎへ →"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ CHOICE STATE ═══════════════════ */}
        {appState === "choice" && story.choicePoint && (
          <motion.div
            key="choice-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8 items-center justify-center"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl mb-4"
            >
              🤔
            </motion.div>
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-black text-gray-800 mb-2 text-center"
            >
              さあ、あなたならどうする？
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-center mb-8 text-sm leading-relaxed"
            >
              {story.choicePoint.question}
            </motion.p>
            <div className="w-full space-y-4">
              {story.choicePoint.options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoiceSelect(i)}
                  className={`w-full rounded-2xl p-4 flex items-center gap-4 shadow-md border-2 text-left transition-all
                    ${profile.bgColor} border-transparent hover:border-current`}
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <div>
                    <p className="font-black text-gray-800">{opt.label}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-xs text-gray-400 text-center"
            >
              どちらを選んでも、物語は続くよ！
            </motion.p>
          </motion.div>
        )}

        {/* ═══════════════════ QUIZ STATE ═══════════════════ */}
        {appState === "quiz" && (
          <motion.div
            key={`quiz-${quizIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-5"
          >
            {/* Quiz type badge */}
            <div className="text-center mb-4">
              <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                currentQuestion.type === "inference"
                  ? "bg-purple-100 text-purple-700"
                  : currentQuestion.type === "true_false"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {currentQuestion.type === "inference"
                  ? "💭 かんがえてみよう"
                  : currentQuestion.type === "true_false"
                  ? "○× ほんとう？うそ？"
                  : "🎯 クイズ"}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {quizIndex + 1} / {story.quiz.length} 問め
                {currentQuestion.type !== "inference" && (
                  <span className="ml-2">🪙+{currentQuestion.points}</span>
                )}
              </p>
            </div>

            {/* Answer score dots */}
            <div className="flex gap-2 justify-center mb-4">
              {story.quiz.map((q, i) => {
                const answered = i < answerLog.length;
                const correct = answered && answerLog[i];
                const isInf = q.type === "inference";
                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      !answered ? "bg-gray-200" : isInf ? "bg-purple-400" : correct ? "bg-green-400" : "bg-red-400"
                    } ${i === quizIndex ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""}`}
                  />
                );
              })}
            </div>

            {/* Question */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
              {currentQuestion.type === "inference" && (
                <p className="text-xs text-purple-500 font-bold mb-2">
                  ※どれでも正解！自分の気持ちを選んでね
                </p>
              )}
              <p className="text-lg font-bold text-gray-800 text-center leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = currentQuestion.type === "inference"
                  ? true
                  : i === currentQuestion.correctIndex;

                let buttonStyle = "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                if (showFeedback) {
                  if (currentQuestion.type === "inference") {
                    buttonStyle = isSelected
                      ? "bg-purple-100 border-2 border-purple-400 text-purple-800"
                      : "bg-white border-2 border-gray-200 text-gray-400 opacity-50";
                  } else if (isCorrect) {
                    buttonStyle = "bg-green-100 border-2 border-green-400 text-green-800 correct-pulse";
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = "bg-red-100 border-2 border-red-400 text-red-800";
                  } else {
                    buttonStyle = "bg-white border-2 border-gray-200 text-gray-400 opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    onClick={() => handleSelectOption(i)}
                    disabled={showFeedback}
                    className={`rounded-2xl px-5 py-4 text-left font-semibold text-base shadow transition-all ${buttonStyle}`}
                  >
                    <span className="mr-2 font-black text-gray-500">
                      {currentQuestion.type === "true_false" ? "" : `${["A", "B", "C", "D"][i]}．`}
                    </span>
                    {option}
                    {showFeedback && currentQuestion.type !== "inference" && isCorrect && (
                      <span className="ml-2 text-green-600 font-bold">✓</span>
                    )}
                    {showFeedback && currentQuestion.type === "inference" && isSelected && (
                      <span className="ml-2 text-purple-600 font-bold">✓ えらんだ！</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showFeedback && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3"
                >
                  <p className="text-sm text-blue-700 leading-relaxed">
                    💡 {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══════════════════ REWARD STATE ═══════════════════ */}
        {appState === "reward" && rewardSummary && (
          <motion.div
            key="reward"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 py-6 text-center"
          >
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              className="text-3xl font-black text-gray-800 mb-1"
            >
              📖 よみおわった！
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-gray-500 mb-5"
            >
              {rewardSummary.isFirstTime ? "はじめてよんだ！すばらしい！" : "また読んでくれてありがとう！"}
            </motion.p>

            {/* Coin/XP reward */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-5 mb-5 w-full max-w-sm shadow-xl"
            >
              <p className="text-white/80 text-xs font-bold mb-3">🎉 かくとくほうしゅう</p>
              <div className="flex justify-around text-white">
                <div>
                  <p className="text-3xl font-black">+{rewardSummary.coinsEarned}</p>
                  <p className="text-sm">🪙 コイン</p>
                </div>
                <div className="w-px bg-white/30" />
                <div>
                  <p className="text-3xl font-black">+{rewardSummary.xpEarned}</p>
                  <p className="text-sm">⭐ XP</p>
                </div>
              </div>
              {rewardSummary.streakBonus > 0 && (
                <p className="text-white/80 text-xs mt-2">
                  🔥 れんぞくよみボーナス +{rewardSummary.streakBonus} コイン含む
                </p>
              )}
            </motion.div>

            {/* Sticker */}
            <div className="mb-5">
              {stickerPopped ? (
                <motion.div className="sticker-pop" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <div className="text-8xl">{story.stickerEmoji}</div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 font-bold text-gray-700"
                  >
                    {story.stickerName} ゲット！
                  </motion.p>
                </motion.div>
              ) : (
                <div className="text-8xl opacity-20">?</div>
              )}
            </div>

            {/* Moral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-5 mb-5 max-w-md w-full"
            >
              <p className="text-sm font-bold text-gray-400 mb-2">📝 きょうのおしえ</p>
              <p className="text-gray-700 leading-relaxed">{story.moral}</p>
            </motion.div>

            {/* New achievement notifications */}
            {rewardSummary.newAchievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-5 w-full max-w-sm"
              >
                {rewardSummary.newAchievements.map((id) => {
                  const ach = getAchievementById(id);
                  if (!ach) return null;
                  return (
                    <div key={id} className="bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-3 mb-2 flex items-center gap-3">
                      <span className="text-3xl">{ach.emoji}</span>
                      <div>
                        <p className="text-xs text-yellow-600 font-bold">🏆 じっせきかいじょ！</p>
                        <p className="font-black text-gray-800">{ach.name}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/${profileId}`)}
                className={`py-4 rounded-2xl text-white font-black text-lg shadow-lg bg-gradient-to-r ${profile.bgGradient}`}
              >
                ほんだなにもどる 📚
              </motion.button>
              <button
                onClick={() => router.push(`/${profileId}/gacha`)}
                className="py-3 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold shadow hover:shadow-md transition-all"
              >
                🎰 ガチャをひく！
              </button>
              <button
                onClick={() => router.push(`/${profileId}/collection`)}
                className="py-3 rounded-2xl bg-white text-gray-600 font-bold shadow border border-gray-200"
              >
                シールをみる →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
