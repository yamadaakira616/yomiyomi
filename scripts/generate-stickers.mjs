/**
 * Sticker image generator using Google Gemini API (free tier)
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... node scripts/generate-stickers.mjs
 *
 * Free tier: 15 requests/min, 1500 requests/day — 50枚は余裕で無料
 * APIキー取得: https://aistudio.google.com/app/apikey
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// .env.local からAPIキーを読み込む
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^GEMINI_API_KEY=(.+)/);
    if (m) process.env.GEMINI_API_KEY = m[1].trim();
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY || GEMINI_API_KEY === "ここにキーを貼り付ける") {
  console.error("❌ GEMINI_API_KEY が設定されていません。");
  console.error("   .env.local の GEMINI_API_KEY= にキーを貼り付けてください。");
  console.error("   キー取得: https://aistudio.google.com/app/apikey");
  process.exit(1);
}

const MODEL = "gemini-3.1-flash-image-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ─── シール定義 ──────────────────────────────────────────────────

const STICKERS = [
  // ぷっくり系
  { id: "puffy_01", folder: "puffy", prompt: "cute kawaii 3D puffy strawberry candy drop sticker, shiny glossy jelly surface, pastel pink, transparent texture, white background, no text" },
  { id: "puffy_02", folder: "puffy", prompt: "cute kawaii 3D puffy blue soda candy drop sticker, shiny glossy surface, bubbles inside, aqua transparent jelly, white background, no text" },
  { id: "puffy_03", folder: "puffy", prompt: "cute kawaii 3D puffy melon candy drop sticker, shiny glossy surface, pale green transparent jelly, white background, no text" },
  { id: "puffy_04", folder: "puffy", prompt: "cute kawaii 3D puffy grape candy drop sticker, shiny glossy surface, purple transparent jelly texture, white background, no text" },
  { id: "puffy_05", folder: "puffy", prompt: "cute kawaii puffy red ruby jewel gem sticker, 3D shiny crystal, sparkling light, white background, no text" },
  { id: "puffy_06", folder: "puffy", prompt: "cute kawaii puffy blue sapphire jewel gem sticker, 3D shiny crystal, sparkling light, white background, no text" },
  { id: "puffy_07", folder: "puffy", prompt: "cute kawaii puffy green emerald jewel gem sticker, 3D shiny crystal, sparkling light, white background, no text" },
  { id: "puffy_08", folder: "puffy", prompt: "cute kawaii puffy rainbow diamond crystal jewel sticker, 3D ultra shiny, rainbow sparkle prismatic light, white background, no text" },
  { id: "puffy_09", folder: "puffy", prompt: "cute fluffy cotton candy cloud sticker, soft pastel pink puff, kawaii round shape, white background, no text" },
  { id: "puffy_10", folder: "puffy", prompt: "cute fluffy lavender cotton puff sticker, soft pastel purple cloud shape, kawaii, white background, no text" },
  { id: "puffy_11", folder: "puffy", prompt: "cute fluffy mint green cotton candy puff sticker, soft pastel cloud, kawaii, white background, no text" },
  { id: "puffy_12", folder: "puffy", prompt: "cute kawaii peach butt sticker, soft pastel peach color, round chubby adorable chibi style, white background, no text" },
  { id: "puffy_13", folder: "puffy", prompt: "cute kawaii pink chibi bottom sticker, soft round shape, funny adorable style, white background, no text" },

  // 機能系
  { id: "func_01", folder: "functional", prompt: "cute kawaii snow globe sticker with snowman inside, glitter snow, mini world, transparent dome, white background, no text" },
  { id: "func_02", folder: "functional", prompt: "cute kawaii water drop sticker with tiny fish swimming inside, ocean blue, liquid motion effect, white background, no text" },
  { id: "func_03", folder: "functional", prompt: "cute kawaii water drop sticker with sakura cherry blossom petals floating inside, pink spring theme, white background, no text" },
  { id: "func_04", folder: "functional", prompt: "cute round glass marble sticker, swirling blue spiral galaxy pattern inside, transparent glossy sphere, kawaii, white background, no text" },
  { id: "func_05", folder: "functional", prompt: "cute round glass marble sticker, swirling pink spiral pattern inside, transparent glossy sphere, kawaii, white background, no text" },
  { id: "func_06", folder: "functional", prompt: "cute round glass marble sticker, swirling green galaxy nebula pattern inside, transparent glossy sphere, kawaii, white background, no text" },
  { id: "func_07", folder: "functional", prompt: "cute round glass marble sticker, rainbow swirl pattern inside, transparent glossy sphere, all colors, kawaii, white background, no text" },
  { id: "func_08", folder: "functional", prompt: "cute mosaic tile sticker with flower pattern, colorful geometric squares, kawaii pixel art style, white background, no text" },
  { id: "func_09", folder: "functional", prompt: "cute mosaic tile sticker with star pattern, colorful geometric squares, kawaii retro pixel art style, white background, no text" },
  { id: "func_10", folder: "functional", prompt: "cute mosaic tile sticker with heart pattern, pastel geometric squares, kawaii pixel art style, white background, no text" },

  // キャラ系
  { id: "char_01", folder: "character", prompt: "cute kawaii pink bunny rabbit sticker, chibi style, big round eyes, simple clean design, pastel pink, white background, no text" },
  { id: "char_02", folder: "character", prompt: "cute kawaii white cat sticker, chibi style, tiny paws, big eyes, simple clean design, white background, no text" },
  { id: "char_03", folder: "character", prompt: "cute kawaii brown teddy bear sticker, chibi style, chubby cheeks, simple clean design, white background, no text" },
  { id: "char_04", folder: "character", prompt: "cute kawaii panda sticker, chibi style, black and white, round head, simple clean design, white background, no text" },
  { id: "char_05", folder: "character", prompt: "cute kawaii brown puppy dog sticker, chibi style, floppy ears, big eyes, simple clean design, white background, no text" },
  { id: "char_06", folder: "character", prompt: "cute kawaii yellow baby chick sticker, chibi style, tiny wings, round body, simple clean design, white background, no text" },
  { id: "char_07", folder: "character", prompt: "cute kawaii orange squirrel sticker, chibi style, fluffy tail, big eyes, holding acorn, simple clean design, white background, no text" },
  { id: "char_08", folder: "character", prompt: "cute kawaii green frog sticker, chibi style, big round eyes, smiling, simple clean design, white background, no text" },
  { id: "char_09", folder: "character", prompt: "cute kawaii smiling star sticker, chibi style, sparkle shimmer, golden yellow, simple clean design, white background, no text" },
  { id: "char_10", folder: "character", prompt: "cute kawaii smiling red heart sticker, chibi style, chubby round, simple clean design, white background, no text" },
  { id: "char_11", folder: "character", prompt: "cute kawaii smiling purple heart sticker, chibi style, chubby round, simple clean design, white background, no text" },
  { id: "char_12", folder: "character", prompt: "cute kawaii fluffy white cloud sticker, chibi style, smiling face, soft pastel blue sky, simple clean design, white background, no text" },
  { id: "char_13", folder: "character", prompt: "cute kawaii rainbow sticker, chibi style, pastel arc with white clouds on each end, simple clean design, white background, no text" },
  { id: "char_14", folder: "character", prompt: "cute kawaii crescent moon sticker, chibi style, sleepy smiling face, pastel yellow, tiny stars, simple clean design, white background, no text" },
  { id: "char_15", folder: "character", prompt: "cute kawaii smiling sun sticker, chibi style, round cheerful face, warm yellow orange rays, simple clean design, white background, no text" },
  { id: "char_16", folder: "character", prompt: "cute kawaii smiling strawberry sticker, chibi style, red with white seeds, green leaf hat, simple clean design, white background, no text" },
  { id: "char_17", folder: "character", prompt: "cute kawaii chocolate donut sticker, chibi style, smiling face, chocolate frosting, colorful sprinkles, simple clean design, white background, no text" },
  { id: "char_18", folder: "character", prompt: "cute kawaii vanilla ice cream cone sticker, chibi style, smiling face, soft swirl, pastel colors, simple clean design, white background, no text" },
  { id: "char_19", folder: "character", prompt: "cute kawaii pink birthday cake slice sticker, chibi style, candle on top, smiling face, simple clean design, white background, no text" },
  { id: "char_20", folder: "character", prompt: "cute kawaii colorful balloon bunch sticker, chibi style, smiling faces on each balloon, pastel colors, simple clean design, white background, no text" },
  { id: "char_21", folder: "character", prompt: "cute kawaii pink ribbon bow sticker, chibi style, shiny satin look, pastel pink, simple clean design, white background, no text" },
  { id: "char_22", folder: "character", prompt: "cute kawaii smiling daisy flower sticker, chibi style, white petals yellow center smiling face, simple clean design, white background, no text" },
  { id: "char_23", folder: "character", prompt: "cute kawaii red mushroom sticker, chibi style, white spots, smiling face, simple clean design, white background, no text" },
  { id: "char_24", folder: "character", prompt: "cute kawaii angel chibi sticker, tiny white wings, golden halo, round face, simple clean design, pastel, white background, no text" },
  { id: "char_25", folder: "character", prompt: "cute kawaii snowman sticker, chibi style, colorful scarf, carrot nose, smiling, simple clean design, white background, no text" },
  { id: "char_26", folder: "character", prompt: "cute kawaii tiny skeleton chibi sticker, funny adorable, big round eyes, simple clean design, white background, no text" },
  { id: "char_27", folder: "character", prompt: "cute kawaii purple butterfly sticker, chibi style, large beautiful wings with decorative patterns, simple clean design, white background, no text" },
];

// ─── 参照画像の読み込み ──────────────────────────────────────────

const REF_DIR = path.join(__dirname, "reference");
const REF_FILES = [
  { file: "asada_4550391911226.jpeg",    mime: "image/jpeg" }, // BONBON DROP ぷっくり3D
  { file: "61BMufa0svL._SL500_.jpg",     mime: "image/jpeg" }, // PP ぷくぷくシール
  { file: "00000014314709_A01.webp",     mime: "image/webp" }, // ウォーターシール
  { file: "koyamashouten_130565.jpeg",   mime: "image/jpeg" }, // うるちゅるPOP SEAL
];

const refParts = REF_FILES
  .map(({ file, mime }) => {
    const p = path.join(REF_DIR, file);
    if (!fs.existsSync(p)) return null;
    return { inlineData: { mimeType: mime, data: fs.readFileSync(p).toString("base64") } };
  })
  .filter(Boolean);

console.log(`📎 参照画像: ${refParts.length} 枚 読み込み済み\n`);

// ─── 生成ロジック ────────────────────────────────────────────────

const DELAY_MS = 4500;  // 15RPM制限対応（60秒÷15 = 4秒/リクエスト + バッファ）
const RETRY_WAIT = 20000;

async function generateImage(sticker, retries = 3) {
  const styleInstruction = refParts.length > 0
    ? `The following images show the TARGET STICKER STYLE. Generate ONE single sticker image that exactly matches this style:\n- 3D puffy glossy jelly-like texture\n- Transparent or semi-transparent look with depth\n- Bright kawaii colors with specular highlights\n- Clean white/transparent background, isolated sticker only\n- No packaging, no sticker sheet, no multiple stickers\n\nNow generate a SINGLE sticker: ${sticker.prompt}`
    : sticker.prompt;

  const body = {
    contents: [{ parts: [...refParts, { text: styleInstruction }] }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });

    if (res.ok) {
      const json = await res.json();
      const parts = json?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
      if (!imagePart) throw new Error("レスポンスに画像データなし");
      return Buffer.from(imagePart.inlineData.data, "base64");
    }

    const errText = await res.text().catch(() => "");
    if (res.status === 429) {
      console.log(`    ⏳ レート制限 (attempt ${attempt}/${retries})... ${RETRY_WAIT / 1000}秒待機`);
      await sleep(RETRY_WAIT);
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 120)}`);
  }
  throw new Error("最大リトライ回数に達しました");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── メイン ──────────────────────────────────────────────────────

async function main() {
  console.log(`🎨 Gemini シール画像生成スタート！ (合計 ${STICKERS.length} 枚)`);
  console.log(`📡 モデル: ${MODEL}`);
  console.log(`⏱  目安: 約 ${Math.ceil(STICKERS.length * DELAY_MS / 60000)} 分\n`);

  // 既存SVGを削除して新しいPNGで上書き
  for (const s of STICKERS) {
    const svgPath = path.join(ROOT, "public", "stickers", s.folder, `${s.id}.svg`);
    if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
  }

  let success = 0, skip = 0, fail = 0;

  for (let i = 0; i < STICKERS.length; i++) {
    const s = STICKERS[i];
    const outDir = path.join(ROOT, "public", "stickers", s.folder);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${s.id}.png`);

    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${STICKERS.length}] ⏭  スキップ (既存): ${s.id}`);
      skip++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${STICKERS.length}] 🖼  生成中: ${s.id} ... `);

    try {
      const buf = await generateImage(s);
      fs.writeFileSync(outPath, buf);
      console.log("✅");
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      fail++;
    }

    if (i < STICKERS.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n🎉 完了！ 成功: ${success}  スキップ: ${skip}  失敗: ${fail}`);
  if (fail > 0) console.log(`💡 失敗分はスクリプトを再実行すると続きから生成されます`);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
