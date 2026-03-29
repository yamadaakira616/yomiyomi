"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GachaCharacter, RARITY_LABELS, RARITY_BG } from "@/data/gacha";
import { useState } from "react";

type Props = {
  character: GachaCharacter | null;
  onClose: () => void;
};

export default function GachaAnimation({ character, onClose }: Props) {
  const [flipped, setFlipped] = useState(false);

  if (!character) return null;

  const rarityBg = RARITY_BG[character.rarity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={flipped ? onClose : undefined}
      >
        {/* Stars burst background */}
        {flipped && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: "50vw", y: "50vh" }}
                animate={{
                  opacity: [1, 0],
                  scale: [0, 1.5],
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                }}
                transition={{ duration: 1.2, delay: i * 0.05 }}
                className="absolute text-2xl"
              >
                {character.rarity === 3 ? "⭐" : "✨"}
              </motion.div>
            ))}
          </div>
        )}

        <div className="relative w-full max-w-sm">
          {!flipped ? (
            /* Face-down card */
            <motion.button
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              onClick={() => setFlipped(true)}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl border-4 border-white/30 cursor-pointer hover:scale-105 transition-transform">
                {/* Animated question mark */}
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl"
                >
                  🎴
                </motion.div>
                <p className="text-white font-black text-xl">タップしてひらく！</p>
                <p className="text-white/70 text-sm">どのキャラクターかな？</p>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex gap-1"
                >
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
                  ))}
                </motion.div>
              </div>
            </motion.button>
          ) : (
            /* Revealed card */
            <motion.div
              initial={{ rotateY: 90, scale: 0.8 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className={`rounded-3xl p-6 flex flex-col items-center gap-4 shadow-2xl border-4
                  ${character.rarity === 3
                    ? "border-yellow-400 ring-4 ring-yellow-300/50"
                    : character.rarity === 2
                    ? "border-blue-400 ring-2 ring-blue-300/30"
                    : "border-gray-300"
                  }
                  ${rarityBg}
                `}
              >
                {/* Rarity indicator */}
                <div className="flex items-center gap-2">
                  {character.rarity === 3 && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="text-2xl"
                    >
                      ✨
                    </motion.span>
                  )}
                  <span
                    className={`font-black text-lg ${
                      character.rarity === 3
                        ? "text-yellow-600"
                        : character.rarity === 2
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {RARITY_LABELS[character.rarity]}
                  </span>
                  {character.rarity === 3 && (
                    <motion.span
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="text-2xl"
                    >
                      ✨
                    </motion.span>
                  )}
                </div>

                {/* Character image or emoji */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
                  className={`p-4 rounded-full bg-gradient-to-br ${character.bgColor} shadow-xl`}
                >
                  {character.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={character.imagePath}
                      alt={character.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-contain drop-shadow-lg"
                    />
                  ) : (
                    <span className="text-8xl">{character.emoji}</span>
                  )}
                </motion.div>

                {/* Character name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-2xl font-black text-gray-800">{character.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{character.description}</p>
                </motion.div>

                {/* Flavor text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-gray-600 italic text-center leading-relaxed"
                >
                  {character.flavorText}
                </motion.div>

                {/* NEW badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black rounded-full px-6 py-2 shadow-lg text-lg"
                >
                  ✨ NEW ゲット！
                </motion.div>

                <p className="text-xs text-gray-400 mt-1">タップしてとじる</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
