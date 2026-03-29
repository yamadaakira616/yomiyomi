export type PetStage = {
  stage: number;
  name: string;
  emoji: string;
  happyEmoji: string;  // used when happiness >= 70
  sadEmoji: string;    // used when happiness < 30
  description: string;
  minReads: number;    // stories completed needed to reach this stage
};

export type PetProfile = {
  profileId: "mushi" | "stamp";
  stages: PetStage[];
  petName: string;
  maxHappiness: number;
};

export const PET_PROFILES: Record<"mushi" | "stamp", PetProfile> = {
  mushi: {
    profileId: "mushi",
    petName: "むしくん",
    maxHappiness: 100,
    stages: [
      {
        stage: 0,
        name: "たまご",
        emoji: "🥚",
        happyEmoji: "🥚",
        sadEmoji: "🥚",
        description: "まだたまご。本を読むとかえるよ！",
        minReads: 0,
      },
      {
        stage: 1,
        name: "あおむし",
        emoji: "🐛",
        happyEmoji: "🐛",
        sadEmoji: "😢",
        description: "あおむしにかえった！もっと本を読もう！",
        minReads: 1,
      },
      {
        stage: 2,
        name: "さなぎ",
        emoji: "🫘",
        happyEmoji: "🫘",
        sadEmoji: "😔",
        description: "さなぎになった！もうすぐちょうちょ？",
        minReads: 3,
      },
      {
        stage: 3,
        name: "ちょうちょ",
        emoji: "🦋",
        happyEmoji: "🦋",
        sadEmoji: "😿",
        description: "きれいなちょうちょになった！すごい！",
        minReads: 5,
      },
    ],
  },
  stamp: {
    profileId: "stamp",
    petName: "ゆめちゃん",
    maxHappiness: 100,
    stages: [
      {
        stage: 0,
        name: "たまご",
        emoji: "🥚",
        happyEmoji: "🥚",
        sadEmoji: "🥚",
        description: "まだたまご。本を読むとかえるよ！",
        minReads: 0,
      },
      {
        stage: 1,
        name: "ひよこ",
        emoji: "🐣",
        happyEmoji: "🐥",
        sadEmoji: "😢",
        description: "ひよこにかえった！かわいいね！",
        minReads: 1,
      },
      {
        stage: 2,
        name: "ねこ",
        emoji: "🐱",
        happyEmoji: "😻",
        sadEmoji: "🙀",
        description: "ねこになった！もっと読んであげてね！",
        minReads: 3,
      },
      {
        stage: 3,
        name: "ユニコーン",
        emoji: "🦄",
        happyEmoji: "🦄",
        sadEmoji: "😿",
        description: "ユニコーンに進化！最強すぎる！！",
        minReads: 5,
      },
    ],
  },
};

export function getPetStage(profileId: "mushi" | "stamp", storiesCompleted: number): PetStage {
  const profile = PET_PROFILES[profileId];
  // Find the highest stage the pet has reached
  const reached = profile.stages
    .filter((s) => storiesCompleted >= s.minReads)
    .at(-1);
  return reached ?? profile.stages[0];
}

export function getNextPetStage(profileId: "mushi" | "stamp", storiesCompleted: number): PetStage | null {
  const profile = PET_PROFILES[profileId];
  const current = getPetStage(profileId, storiesCompleted);
  const next = profile.stages.find((s) => s.stage === current.stage + 1);
  return next ?? null;
}

/** Compute happiness (0-100) based on days since last read */
export function computeHappiness(lastReadDate: string | undefined, baseHappiness: number): number {
  if (!lastReadDate) return 20; // never read → low happiness
  const today = new Date().toISOString().split("T")[0];
  if (lastReadDate === today) return Math.min(100, baseHappiness + 20);

  const last = new Date(lastReadDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(5, baseHappiness - diffDays * 15);
}

export function getHappinessMood(happiness: number): "happy" | "normal" | "sad" {
  if (happiness >= 70) return "happy";
  if (happiness >= 35) return "normal";
  return "sad";
}

export const HAPPINESS_MESSAGES: Record<string, string[]> = {
  happy: [
    "げんきいっぱい！読んでくれてありがとう！",
    "うれしいよ～！もっと読んで！",
    "さいこうにしあわせ！！",
  ],
  normal: [
    "まあまあかな。本を読んでくれると嬉しいな。",
    "もうちょっと読んでね！",
    "楽しみに待ってるよ！",
  ],
  sad: [
    "さびしいよ～。本を読んでくれないかな？",
    "ちょっと元気がないよ。本を読んで！",
    "はやく本を読んでほしいな…",
  ],
};
