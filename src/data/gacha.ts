export type GachaRarity = 1 | 2 | 3;

export type GachaCharacter = {
  id: string;
  profileId: "mushi" | "stamp";
  name: string;
  emoji: string;
  imagePath?: string; // 画像URLがある場合はこちらを優先表示
  rarity: GachaRarity;
  probability: number; // 0-100
  description: string;
  bgColor: string; // Tailwindグラデーションクラス or HEXカラー
  flavorText: string;
};

export const PULL_COST = 200; // coins per pull

// Twemoji CDN helper
const tw = (hex: string) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${hex}.png`;

export const GACHA_CHARACTERS: GachaCharacter[] = [
  // ===== むしはかせ マスコット =====
  {
    id: "g-mushi-1",
    profileId: "mushi",
    name: "チームアリ",
    emoji: "🐜",
    rarity: 1,
    probability: 35,
    description: "なかまとちからをあわせるプロ！",
    bgColor: "from-yellow-300 to-amber-400",
    flavorText: "「ひとりじゃできないことも、みんなでやれば必ずできる！」",
  },
  {
    id: "g-mushi-2",
    profileId: "mushi",
    name: "モコちょうちょ",
    emoji: "🦋",
    rarity: 1,
    probability: 35,
    description: "あおむしからへんしんしたゆうかんなこ！",
    bgColor: "from-purple-300 to-violet-400",
    flavorText: "「どんな姿でも、わたしはわたし。変化を恐れないで！」",
  },
  {
    id: "g-mushi-3",
    profileId: "mushi",
    name: "ホタルヒカル",
    emoji: "✨",
    rarity: 2,
    probability: 15,
    description: "やさしいひかりで夜をてらすスーパーホタル！",
    bgColor: "from-blue-300 to-cyan-400",
    flavorText: "「小さな光でも、誰かを照らせる。自分を信じよう！」",
  },
  {
    id: "g-mushi-4",
    profileId: "mushi",
    name: "カブクワコンビ",
    emoji: "🪲",
    rarity: 2,
    probability: 10,
    description: "ちがいをいかしてさいきょうタッグ！",
    bgColor: "from-orange-300 to-amber-500",
    flavorText: "「ちがうからこそ最強！違いは弱さじゃなく強さだよ！」",
  },
  {
    id: "g-mushi-5",
    profileId: "mushi",
    name: "ゴールデンハナ ✦",
    emoji: "🐝",
    rarity: 3,
    probability: 5,
    description: "【超レア！】きんいろのミツバチ！コツコツのシンボル！",
    bgColor: "from-yellow-400 via-amber-400 to-orange-400",
    flavorText: "「今日の小さな努力が、未来の黄金の宝物になる！」",
  },

  // ===== むしはかせ シール — バトル (rarity 3) =====
  { id: "mushi-bt01", profileId: "mushi", name: "タガメ", emoji: "💧", imagePath: "/assets/insects/bt01.jpg", rarity: 3, probability: 1, description: "日本最大の水生昆虫。水中の最強ハンター！", bgColor: "#1e3a5f", flavorText: "「幻の昆虫との出会いに感謝！」" },
  { id: "mushi-bt02", profileId: "mushi", name: "ニジイロクワガタ", emoji: "🌈", imagePath: "/assets/insects/bt02.jpg", rarity: 3, probability: 1, description: "虹のように輝く世界最美のクワガタ！", bgColor: "#14532d", flavorText: "「七色に輝く美しさは本物だ！」" },
  { id: "mushi-bt03", profileId: "mushi", name: "ヤマトタマムシ", emoji: "💎", imagePath: "/assets/insects/bt03.jpg", rarity: 3, probability: 1, description: "「飛ぶ宝石」と呼ばれる日本の美しい昆虫！", bgColor: "#134e4a", flavorText: "「法隆寺にも使われた幻の宝石虫！」" },
  { id: "mushi-bt04", profileId: "mushi", name: "ゴライアスオオツノハナムグリ", emoji: "🏆", imagePath: "/assets/insects/bt04.jpg", rarity: 3, probability: 1, description: "世界最重の飛翔昆虫。昆虫界の王者！", bgColor: "#1c1917", flavorText: "「巨人ゴリアテの名を持つ昆虫の王！」" },
  { id: "mushi-bt05", profileId: "mushi", name: "ヨナグニサン", emoji: "🦋", imagePath: "/assets/insects/bt05.jpg", rarity: 3, probability: 1, description: "世界最大の蛾。翅を広げると30cmにも達する！", bgColor: "#78350f", flavorText: "「翅の蛇頭模様で天敵を威嚇する！」" },
  { id: "mushi-bt06", profileId: "mushi", name: "コーカサスオオカブト", emoji: "🪲", imagePath: "/assets/insects/bt06.jpg", rarity: 3, probability: 1, description: "3本の角を持つカブトムシの王者！「生きた戦車」！", bgColor: "#1c1917", flavorText: "「最強のカブトムシがついに登場！」" },

  // ===== むしはかせ シール — レジェンド (rarity 3) =====
  { id: "mushi-lg01", profileId: "mushi", name: "ダイオウヒラタクワガタ", emoji: "🥇", imagePath: "/assets/insects/lg01.jpg", rarity: 3, probability: 1, description: "世界最大級のヒラタクワガタ。パラワン島の伝説！", bgColor: "#0f0a1e", flavorText: "「100mmを超える驚異の顎の力！」" },
  { id: "mushi-lg02", profileId: "mushi", name: "リオック", emoji: "🦗", imagePath: "/assets/insects/lg02.jpg", rarity: 3, probability: 1, description: "世界最重量級の昆虫。「生きた化石」！", bgColor: "#1c1507", flavorText: "「数千万年前から姿を変えていない！」" },
  { id: "mushi-lg03", profileId: "mushi", name: "オオエンマハンミョウ", emoji: "💚", imagePath: "/assets/insects/lg03.jpg", rarity: 3, probability: 1, description: "日本最大のハンミョウ。宝石のような体色！", bgColor: "#052e16", flavorText: "「幻の昆虫を見つけた！超ラッキー！」" },

  // ===== むしはかせ シール — ウルトラ (rarity 2) =====
  { id: "mushi-u01", profileId: "mushi", name: "スマトラオオヒラタクワガタ", emoji: "🪲", imagePath: "/assets/insects/u01.jpg", rarity: 2, probability: 2, description: "世界最大級のヒラタクワガタ。挟む力が超強い！", bgColor: "#1c1917", flavorText: "「スマトラ島の森の王者！」" },
  { id: "mushi-u02", profileId: "mushi", name: "メタリフェルホソアカクワガタ", emoji: "🥈", imagePath: "/assets/insects/u02.jpg", rarity: 2, probability: 2, description: "体長の半分以上を占める巨大な大顎が特徴！", bgColor: "#713f12", flavorText: "「金属光沢が美しい！」" },
  { id: "mushi-u03", profileId: "mushi", name: "マンディブラリスフタマタクワガタ", emoji: "✌️", imagePath: "/assets/insects/u03.jpg", rarity: 2, probability: 2, description: "世界最大のフタマタクワガタ！V字の大顎が迫力満点！", bgColor: "#1e1b4b", flavorText: "「V字型の大顎が圧倒的な存在感！」" },
  { id: "mushi-u04", profileId: "mushi", name: "オウゴンオニクワガタ", emoji: "✨", imagePath: "/assets/insects/u04.jpg", rarity: 2, probability: 2, description: "黄金色に輝く体色が圧倒的に美しい宝石の甲虫！", bgColor: "#713f12", flavorText: "「黄金に輝く！コレクター垂涎の一匹！」" },
  { id: "mushi-u05", profileId: "mushi", name: "ネプチューンオオカブト", emoji: "🔱", imagePath: "/assets/insects/u05.jpg", rarity: 2, probability: 2, description: "アンデス山脈の幻の大型カブトムシ！", bgColor: "#064e3b", flavorText: "「海神ネプチューンの名を持つ幻の王！」" },
  { id: "mushi-u06", profileId: "mushi", name: "モーレンカンプオウゴンオニクワガタ", emoji: "💙", imagePath: "/assets/insects/u06.jpg", rarity: 2, probability: 2, description: "青みがかった金属光沢が神秘的！", bgColor: "#1e3a5f", flavorText: "「青金の輝きは唯一無二！」" },

  // ===== むしはかせ シール — スーパーレア (rarity 2) =====
  { id: "mushi-s01", profileId: "mushi", name: "オオクワガタ", emoji: "🪲", imagePath: "/assets/insects/s01.jpg", rarity: 2, probability: 2, description: "日本最大のクワガタ。「クワガタの王様」！", bgColor: "#292524", flavorText: "「クヌギの樹液に集まる王様！」" },
  { id: "mushi-s02", profileId: "mushi", name: "アクベシアヌスミヤマクワガタ", emoji: "🏔️", imagePath: "/assets/insects/s02.jpg", rarity: 2, probability: 2, description: "トルコ南部の山岳に生息する希少なクワガタ！", bgColor: "#1c1917", flavorText: "「ヨーロッパとアジアの境界の昆虫！」" },
  { id: "mushi-s03", profileId: "mushi", name: "ブケファルスミヤマクワガタ", emoji: "🌏", imagePath: "/assets/insects/s03.jpg", rarity: 2, probability: 2, description: "中国南部の深い森に生息。力強い大顎が特徴！", bgColor: "#422006", flavorText: "「深い森の奥から来た大型クワガタ！」" },
  { id: "mushi-s04", profileId: "mushi", name: "プラナトゥスミヤマクワガタ", emoji: "🌿", imagePath: "/assets/insects/s04.jpg", rarity: 2, probability: 2, description: "ベトナム高地に分布する個性的なクワガタ！", bgColor: "#14532d", flavorText: "「ベトナムの山の中で出会えた！」" },
  { id: "mushi-s05", profileId: "mushi", name: "アルキデスヒラタクワガタ", emoji: "💪", imagePath: "/assets/insects/s05.jpg", rarity: 2, probability: 2, description: "スマトラ・ボルネオの大型ヒラタ！", bgColor: "#1e293b", flavorText: "「がっしりした体が頼もしい！」" },
  { id: "mushi-s06", profileId: "mushi", name: "パリーフタマタクワガタ", emoji: "✂️", imagePath: "/assets/insects/s06.jpg", rarity: 2, probability: 2, description: "鋭く二股に分かれた大顎が名前の由来！", bgColor: "#3b1f0a", flavorText: "「ボルネオ島産の大型フタマタ！」" },
  { id: "mushi-s07", profileId: "mushi", name: "ヘラクレスオオカブト", emoji: "🪲", imagePath: "/assets/insects/s07.jpg", rarity: 2, probability: 2, description: "世界最長の甲虫！カブトムシの王者！", bgColor: "#365314", flavorText: "「ギリシャ神話の英雄の名を持つ王者！」" },
  { id: "mushi-s08", profileId: "mushi", name: "ゴライアスオオツノハナムグリ", emoji: "🌍", imagePath: "/assets/insects/s08.jpg", rarity: 2, probability: 2, description: "世界最重量の昆虫のひとつ！幼虫は100gを超える！", bgColor: "#713f12", flavorText: "「旧約聖書の巨人に由来する名前！」" },
  { id: "mushi-s09", profileId: "mushi", name: "ゲンジボタル", emoji: "✨", imagePath: "/assets/insects/s09.jpg", rarity: 2, probability: 2, description: "日本の清流に生息するホタルの代表種！", bgColor: "#0c1a1a", flavorText: "「幻想的な光が夏の夜を彩る！」" },
  { id: "mushi-s10", profileId: "mushi", name: "パラワンオオヒラタクワガタ", emoji: "🪲", imagePath: "/assets/insects/s10.jpg", rarity: 2, probability: 2, description: "挟む力が昆虫界トップクラス！", bgColor: "#1c1917", flavorText: "「106mmに達する巨大ヒラタ！」" },
  { id: "mushi-s11", profileId: "mushi", name: "グラントシロカブト", emoji: "⬜", imagePath: "/assets/insects/s11.jpg", rarity: 2, probability: 2, description: "北アメリカ産最大のカブトムシ！白い体が珍しい！", bgColor: "#d6d3d1", flavorText: "「白と黒の斑点模様が特徴的！」" },
  { id: "mushi-s12", profileId: "mushi", name: "ビノクルスミヤマクワガタ", emoji: "👀", imagePath: "/assets/insects/s12.jpg", rarity: 2, probability: 2, description: "大きな複眼が特徴的なミヤマクワガタ！", bgColor: "#422006", flavorText: "「ニューギニア周辺に生息する個性派！」" },
  { id: "mushi-s13", profileId: "mushi", name: "アヌビスゾウカブト", emoji: "🐘", imagePath: "/assets/insects/s13.jpg", rarity: 2, probability: 2, description: "世界最重量級のカブトムシのひとつ！", bgColor: "#713f12", flavorText: "「金色の毛に覆われた太い角が迫力！」" },
  { id: "mushi-s14", profileId: "mushi", name: "ラコダールツヤクワガタ", emoji: "🖤", imagePath: "/assets/insects/s14.jpg", rarity: 2, probability: 2, description: "漆黒の体に細長い大顎が品格を放つ！", bgColor: "#1c1917", flavorText: "「インドの森から来た黒い貴公子！」" },
  { id: "mushi-s15", profileId: "mushi", name: "モリモトミヤマクワガタ", emoji: "🗻", imagePath: "/assets/insects/s15.jpg", rarity: 2, probability: 2, description: "台湾の高山に生息する大型ミヤマ！", bgColor: "#292524", flavorText: "「台湾の山の頂上で出会う大型種！」" },
  { id: "mushi-s16", profileId: "mushi", name: "ワラストンツヤクワガタ", emoji: "⚫", imagePath: "/assets/insects/s16.jpg", rarity: 2, probability: 2, description: "黒光りする体と独特な大顎のクワガタ！", bgColor: "#1c1917", flavorText: "「ボルネオの森の漆黒の騎士！」" },
  { id: "mushi-s17", profileId: "mushi", name: "チャルコソマ・モエレンカンピ", emoji: "🔱", imagePath: "/assets/insects/s17.jpg", rarity: 2, probability: 2, description: "ボルネオ産の巨大な3本角カブトムシ！", bgColor: "#14532d", flavorText: "「密林の王者として君臨する！」" },
  { id: "mushi-s18", profileId: "mushi", name: "ヒルスシカクワガタ", emoji: "🦌", imagePath: "/assets/insects/s18.jpg", rarity: 2, probability: 2, description: "ヒマラヤ山麓に生息する美しい大型クワガタ！", bgColor: "#3b1f0a", flavorText: "「コレクター垂涎の曲線美の大顎！」" },

  // ===== むしはかせ シール — レア (rarity 1) =====
  { id: "mushi-r01", profileId: "mushi", name: "ミヤマクワガタ", emoji: "🪲", imagePath: "/assets/insects/r01.jpg", rarity: 1, probability: 3, description: "日本の山地に生息。金色の産毛が特徴！", bgColor: "#78350f", flavorText: "「夏の夜にひとりで採れたら最高！」" },
  { id: "mushi-r02", profileId: "mushi", name: "オオヒラタクワガタ", emoji: "🪲", imagePath: "/assets/insects/r02.jpg", rarity: 1, probability: 3, description: "東南アジア各地に広く分布する大型種！", bgColor: "#1c1917", flavorText: "「亜種・地域変異が非常に豊富！」" },
  { id: "mushi-r03", profileId: "mushi", name: "ディディエールシカクワガタ", emoji: "🦌", imagePath: "/assets/insects/r03.jpg", rarity: 1, probability: 3, description: "シカの角のような大顎が個性的！", bgColor: "#3b1f0a", flavorText: "「アフリカの熱帯雨林からの使者！」" },
  { id: "mushi-r04", profileId: "mushi", name: "ネブトクワガタ", emoji: "🪲", imagePath: "/assets/insects/r04.jpg", rarity: 1, probability: 3, description: "光沢のある黒い体の小型クワガタ！", bgColor: "#292524", flavorText: "「朽木の中に隠れている隠れキャラ！」" },
  { id: "mushi-r05", profileId: "mushi", name: "アルケスツヤクワガタ", emoji: "✨", imagePath: "/assets/insects/r05.jpg", rarity: 1, probability: 3, description: "ピカピカに輝く黒い体色が美しい！", bgColor: "#14532d", flavorText: "「鏡のような光沢が自慢！」" },
  { id: "mushi-r06", profileId: "mushi", name: "タランドゥスオオツヤクワガタ", emoji: "🖤", imagePath: "/assets/insects/r06.jpg", rarity: 1, probability: 3, description: "漆黒でミラーのような光沢が特徴！", bgColor: "#1c1917", flavorText: "「コンゴ盆地の熱帯雨林に生息！」" },
  { id: "mushi-r07", profileId: "mushi", name: "エラフスホソアカクワガタ", emoji: "🪲", imagePath: "/assets/insects/r07.jpg", rarity: 1, probability: 3, description: "スマトラ産のホソアカクワガタ最大種！", bgColor: "#422006", flavorText: "「細長い体と鋭い大顎が特徴！」" },
  { id: "mushi-r08", profileId: "mushi", name: "ヤマトタマムシ", emoji: "💚", imagePath: "/assets/insects/r08.jpg", rarity: 1, probability: 3, description: "日本最美の甲虫とも呼ばれる宝石虫！", bgColor: "#166534", flavorText: "「死後も色が変わらない構造色の神秘！」" },
  { id: "mushi-r09", profileId: "mushi", name: "アトラスオオカブト", emoji: "🔱", imagePath: "/assets/insects/r09.jpg", rarity: 1, probability: 3, description: "東南アジアの3本角カブトムシ！", bgColor: "#1e1b4b", flavorText: "「ギリシャ神話の巨人の名を持つ！」" },
  { id: "mushi-r10", profileId: "mushi", name: "レギウスオオツヤクワガタ", emoji: "👑", imagePath: "/assets/insects/r10.jpg", rarity: 1, probability: 3, description: "「王」の名の通り、威厳ある黒光りの体！", bgColor: "#292524", flavorText: "「カメルーン産の王様クワガタ！」" },
  { id: "mushi-r11", profileId: "mushi", name: "ニジイロクワガタ", emoji: "🌈", imagePath: "/assets/insects/r11.jpg", rarity: 1, probability: 3, description: "虹色に輝く美しい体色！コレクターに大人気！", bgColor: "#14532d", flavorText: "「オーストラリア産の虹色の宝石！」" },
  { id: "mushi-r12", profileId: "mushi", name: "ギラファノコギリクワガタ", emoji: "🦒", imagePath: "/assets/insects/r12.jpg", rarity: 1, probability: 3, description: "世界最大のノコギリクワガタ！", bgColor: "#713f12", flavorText: "「キリンのように長い大顎を持つ！」" },
  { id: "mushi-r13", profileId: "mushi", name: "ヨーロッパミヤマクワガタ", emoji: "🦌", imagePath: "/assets/insects/r13.jpg", rarity: 1, probability: 3, description: "ヨーロッパ最大のクワガタ！英名は「Stag Beetle」！", bgColor: "#78350f", flavorText: "「シカの角に似た大顎が格好いい！」" },
  { id: "mushi-r14", profileId: "mushi", name: "コーカサスオオカブト", emoji: "🪲", imagePath: "/assets/insects/r14.jpg", rarity: 1, probability: 3, description: "三本の角で相手を挟む戦闘スタイルが迫力満点！", bgColor: "#1c1917", flavorText: "「東南アジア3本角カブトの最大種！」" },
  { id: "mushi-r15", profileId: "mushi", name: "アクタエオンゾウカブト", emoji: "🐘", imagePath: "/assets/insects/r15.jpg", rarity: 1, probability: 3, description: "アマゾン流域に生息する世界最重量級！", bgColor: "#365314", flavorText: "「分厚い体に短く太い角が迫力！」" },
  { id: "mushi-r16", profileId: "mushi", name: "ゴホンヅノカブト", emoji: "5️⃣", imagePath: "/assets/insects/r16.jpg", rarity: 1, probability: 3, description: "計5本の角を持つユニークなカブトムシ！", bgColor: "#365314", flavorText: "「5本の角は東南アジアの山地に生息！」" },
  { id: "mushi-r17", profileId: "mushi", name: "ヘラジカオオカブト", emoji: "🦌", imagePath: "/assets/insects/r17.jpg", rarity: 1, probability: 3, description: "メキシコ産の青緑色の斑点模様が美しい！", bgColor: "#064e3b", flavorText: "「ヘラクレスに近縁の大型カブトムシ！」" },
  { id: "mushi-r18", profileId: "mushi", name: "アマミミヤマクワガタ", emoji: "🏝️", imagePath: "/assets/insects/r18.jpg", rarity: 1, probability: 3, description: "奄美大島固有のミヤマクワガタ！", bgColor: "#78350f", flavorText: "「奄美の森だけで見られる固有種！」" },
  { id: "mushi-r19", profileId: "mushi", name: "フォルスターフタマタクワガタ", emoji: "✌️", imagePath: "/assets/insects/r19.jpg", rarity: 1, probability: 3, description: "鋭い大顎の形状が独特なスマトラ産種！", bgColor: "#422006", flavorText: "「個性的なフタマタクワガタ！」" },
  { id: "mushi-r20", profileId: "mushi", name: "ハナカマキリ", emoji: "🌸", imagePath: "/assets/insects/r20.jpg", rarity: 1, probability: 3, description: "蘭の花に擬態した世界一美しいカマキリ！", bgColor: "#fce7f3", flavorText: "「ピンク色の体が花びらそっくり！」" },
  { id: "mushi-r21", profileId: "mushi", name: "コノハムシ", emoji: "🍃", imagePath: "/assets/insects/r21.jpg", rarity: 1, probability: 3, description: "葉っぱそっくり！世界最大のコノハムシ！", bgColor: "#166534", flavorText: "「完璧な擬態は自然界の奇跡！」" },
  { id: "mushi-r22", profileId: "mushi", name: "ナナフシ（世界最長種）", emoji: "🌿", imagePath: "/assets/insects/r22.jpg", rarity: 1, probability: 3, description: "世界最長の昆虫！足を広げると50cm以上！", bgColor: "#166534", flavorText: "「ボルネオの固有種！幻の長さ！」" },
  { id: "mushi-r23", profileId: "mushi", name: "モルフォチョウ", emoji: "🦋", imagePath: "/assets/insects/r23.jpg", rarity: 1, probability: 3, description: "熱帯雨林を飛び交う宝石のような青い蝶！", bgColor: "#1e3a5f", flavorText: "「構造色の青は世界一美しい！」" },
  { id: "mushi-r24", profileId: "mushi", name: "アカアシクワガタ", emoji: "🪲", imagePath: "/assets/insects/r24.jpg", rarity: 1, probability: 3, description: "赤みがかった脚が名前の由来。日本の山地に生息！", bgColor: "#78350f", flavorText: "「赤い脚がトレードマーク！」" },
  { id: "mushi-r25", profileId: "mushi", name: "クロカタゾウムシ", emoji: "💪", imagePath: "/assets/insects/r25.jpg", rarity: 1, probability: 3, description: "世界で最も硬い昆虫！車に踏まれても死なない！", bgColor: "#1c1917", flavorText: "「最強の硬さを誇るフィリピンの昆虫！」" },
  { id: "mushi-r26", profileId: "mushi", name: "ギガスアリ", emoji: "🐜", imagePath: "/assets/insects/r26.jpg", rarity: 1, probability: 3, description: "世界最大のアリ！熱帯林の生態系に欠かせない！", bgColor: "#292524", flavorText: "「強力な顎でなんでも噛み切る！」" },
  { id: "mushi-r27", profileId: "mushi", name: "ウスバカゲロウ（大型種）", emoji: "🌙", imagePath: "/assets/insects/r27.jpg", rarity: 1, probability: 3, description: "透き通った翅に美しい斑紋！優雅に飛翔する！", bgColor: "#fef9c3", flavorText: "「南ヨーロッパの優雅な飛翔者！」" },
  { id: "mushi-r28", profileId: "mushi", name: "タイワンタケクマバチ", emoji: "🐝", imagePath: "/assets/insects/r28.jpg", rarity: 1, probability: 3, description: "青黒く輝く！竹に穴を掘って巣を作るハチ！", bgColor: "#1e293b", flavorText: "「ハチとは思えない美しさ！」" },
  { id: "mushi-r29", profileId: "mushi", name: "タイタマムシ", emoji: "💎", imagePath: "/assets/insects/r29.jpg", rarity: 1, probability: 3, description: "太陽光で輝く赤・緑・金の金属光沢！", bgColor: "#166534", flavorText: "「タイ産タマムシ最大種のひとつ！」" },
  { id: "mushi-r30", profileId: "mushi", name: "ハナカマキリ（白型）", emoji: "🌷", imagePath: "/assets/insects/r30.jpg", rarity: 1, probability: 3, description: "真っ白な体色のハナカマキリ変異型！自然界の奇跡！", bgColor: "#f0fdf4", flavorText: "「白い花に完全に溶け込む擬態！」" },

  // ===== むしはかせ シール — ノーマル (rarity 1) =====
  { id: "mushi-c01", profileId: "mushi", name: "コクワガタ", emoji: "🪲", imagePath: "/assets/insects/c01.jpg", rarity: 1, probability: 4, description: "日本全国の雑木林に生息するクワガタ入門種！", bgColor: "#d1fae5", flavorText: "「クワガタの世界への入口はここから！」" },
  { id: "mushi-c02", profileId: "mushi", name: "ノコギリクワガタ", emoji: "🪲", imagePath: "/assets/insects/c02.jpg", rarity: 1, probability: 4, description: "日本で最もよく見られるクワガタのひとつ！", bgColor: "#fef3c7", flavorText: "「ギザギザの大顎でノコギリそのまま！」" },
  { id: "mushi-c03", profileId: "mushi", name: "スジクワガタ", emoji: "🪲", imagePath: "/assets/insects/c03.jpg", rarity: 1, probability: 4, description: "上翅の縦筋が名前の由来。コクワに似た小型種！", bgColor: "#e7e5e4", flavorText: "「細かい縦筋がトレードマーク！」" },
  { id: "mushi-c04", profileId: "mushi", name: "ヒラタクワガタ", emoji: "🪲", imagePath: "/assets/insects/c04.jpg", rarity: 1, probability: 4, description: "挟む力が強い！クワガタ相撲の強者！", bgColor: "#dbeafe", flavorText: "「扁平な体で木の隙間に潜り込む！」" },
  { id: "mushi-c05", profileId: "mushi", name: "カブトムシ", emoji: "🪲", imagePath: "/assets/insects/c05.jpg", rarity: 1, probability: 4, description: "夏の王者！日本を代表する甲虫！", bgColor: "#dcfce7", flavorText: "「日本の夏はカブトムシから始まる！」" },
  { id: "mushi-c06", profileId: "mushi", name: "テントウムシ", emoji: "🐞", imagePath: "/assets/insects/c06.jpg", rarity: 1, probability: 4, description: "7つの黒い斑点を持つ赤い益虫！", bgColor: "#fee2e2", flavorText: "「農家の味方！アブラムシを食べる！」" },
  { id: "mushi-c07", profileId: "mushi", name: "カナブン", emoji: "🪲", imagePath: "/assets/insects/c07.jpg", rarity: 1, probability: 4, description: "緑色の金属光沢を持つコガネムシの仲間！", bgColor: "#d9f99d", flavorText: "「クワガタと同じ樹液に集まる常連！」" },
  { id: "mushi-c08", profileId: "mushi", name: "ショウリョウバッタ", emoji: "🦗", imagePath: "/assets/insects/c08.jpg", rarity: 1, probability: 4, description: "日本最大のバッタ。跳躍力が高い！", bgColor: "#ecfccb", flavorText: "「草原をびゅんびゅん飛び回る！」" },
  { id: "mushi-c09", profileId: "mushi", name: "ナナフシ", emoji: "🌿", imagePath: "/assets/insects/c09.jpg", rarity: 1, probability: 4, description: "木の枝そっくりに擬態する昆虫！", bgColor: "#d1fae5", flavorText: "「枝に見えるがちゃんと生きている！」" },
  { id: "mushi-c10", profileId: "mushi", name: "オニヤンマ", emoji: "🦟", imagePath: "/assets/insects/c10.jpg", rarity: 1, probability: 4, description: "日本最大のトンボ！時速70kmで飛翔！", bgColor: "#cffafe", flavorText: "「ハチもアブも捕食する昆虫界の戦闘機！」" },
  { id: "mushi-c11", profileId: "mushi", name: "アキアカネ", emoji: "🦟", imagePath: "/assets/insects/c11.jpg", rarity: 1, probability: 4, description: "秋の日本を代表する赤いトンボ！", bgColor: "#fee2e2", flavorText: "「秋になると山から平地に降りてくる！」" },
  { id: "mushi-c12", profileId: "mushi", name: "モンシロチョウ", emoji: "🦋", imagePath: "/assets/insects/c12.jpg", rarity: 1, probability: 4, description: "日本で最もよく見られる白い蝶！", bgColor: "#f0fdf4", flavorText: "「キャベツ畑でよく見かける身近な蝶！」" },
  { id: "mushi-c13", profileId: "mushi", name: "アゲハチョウ", emoji: "🦋", imagePath: "/assets/insects/c13.jpg", rarity: 1, probability: 4, description: "黄色と黒の縞模様が美しい日本代表の蝶！", bgColor: "#fef9c3", flavorText: "「柑橘類の葉に産卵する美しい蝶！」" },
  { id: "mushi-c14", profileId: "mushi", name: "ニホンミツバチ", emoji: "🐝", imagePath: "/assets/insects/c14.jpg", rarity: 1, probability: 4, description: "スズメバチを熱球で撃退する知恵者！", bgColor: "#fef3c7", flavorText: "「日本固有のミツバチの知恵に感動！」" },
  { id: "mushi-c15", profileId: "mushi", name: "アブラゼミ", emoji: "🦟", imagePath: "/assets/insects/c15.jpg", rarity: 1, probability: 4, description: "日本で最もよく見られるセミ！夏の大合唱！", bgColor: "#fef3c7", flavorText: "「夏の夕暮れの大合唱が懐かしい！」" },
  { id: "mushi-c16", profileId: "mushi", name: "クロアゲハ", emoji: "🦋", imagePath: "/assets/insects/c16.jpg", rarity: 1, probability: 4, description: "光に当たると青紫に光る美しい黒いアゲハ！", bgColor: "#292524", flavorText: "「黒い翅の青紫の輝きが美しい！」" },
  { id: "mushi-c17", profileId: "mushi", name: "シオカラトンボ", emoji: "🦟", imagePath: "/assets/insects/c17.jpg", rarity: 1, probability: 4, description: "成熟したオスは青白い体色に！夏の田んぼの常連！", bgColor: "#e0f2fe", flavorText: "「水辺のシオカラトンボを見つけよう！」" },
  { id: "mushi-c18", profileId: "mushi", name: "オオスズメバチ", emoji: "🐝", imagePath: "/assets/insects/c18.jpg", rarity: 1, probability: 4, description: "世界最大のスズメバチ！強力な毒に注意！", bgColor: "#fef3c7", flavorText: "「危険だけど昆虫界の強者！」" },
  { id: "mushi-c19", profileId: "mushi", name: "ゲンゴロウ", emoji: "💧", imagePath: "/assets/insects/c19.jpg", rarity: 1, probability: 4, description: "日本最大の水生甲虫！今は希少な存在！", bgColor: "#166534", flavorText: "「昔は田んぼに多く生息していた！」" },
  { id: "mushi-c20", profileId: "mushi", name: "ミンミンゼミ", emoji: "🦟", imagePath: "/assets/insects/c20.jpg", rarity: 1, probability: 4, description: "最も大きな声で鳴くセミ！夏の風物詩！", bgColor: "#dcfce7", flavorText: "「透明な翅に緑の斑紋が美しい！」" },
  { id: "mushi-c21", profileId: "mushi", name: "モンキチョウ", emoji: "🦋", imagePath: "/assets/insects/c21.jpg", rarity: 1, probability: 4, description: "黄色い翅に黒い紋模様。草原や農地に生息！", bgColor: "#fef9c3", flavorText: "「クローバーの花が大好き！」" },
  { id: "mushi-c22", profileId: "mushi", name: "エンマコオロギ", emoji: "🦗", imagePath: "/assets/insects/c22.jpg", rarity: 1, probability: 4, description: "秋の夜に「コロコロ」と鳴く日本最大のコオロギ！", bgColor: "#292524", flavorText: "「古くから鳴き声が愛でられてきた！」" },
  { id: "mushi-c23", profileId: "mushi", name: "ヤマトシジミ", emoji: "🦋", imagePath: "/assets/insects/c23.jpg", rarity: 1, probability: 4, description: "日本で最も身近な小型の蝶！街中でも見られる！", bgColor: "#dbeafe", flavorText: "「カタバミの葉を食草とする身近な蝶！」" },
  { id: "mushi-c24", profileId: "mushi", name: "ルリタテハ", emoji: "🦋", imagePath: "/assets/insects/c24.jpg", rarity: 1, probability: 4, description: "青紫の帯が走るタテハチョウ！裏は枯れ葉に擬態！", bgColor: "#dbeafe", flavorText: "「翅の裏の擬態が見事！」" },

  // ===== スタンプガール マスコット =====
  {
    id: "g-stamp-1",
    profileId: "stamp",
    name: "サクラうさぎ",
    emoji: "🐰",
    rarity: 1,
    probability: 35,
    description: "みんなにやさしいピンクのうさぎちゃん！",
    bgColor: "from-pink-300 to-rose-400",
    flavorText: "「思いやりの心が、世界を明るくするの！」",
  },
  {
    id: "g-stamp-2",
    profileId: "stamp",
    name: "ミミにゃん",
    emoji: "🐱",
    rarity: 1,
    probability: 35,
    description: "ゆうきのかたまり！こまっているこをたすけるねこ！",
    bgColor: "from-violet-300 to-purple-400",
    flavorText: "「困ったときは「助けて」って言っていいよ！勇気だよ！」",
  },
  {
    id: "g-stamp-3",
    profileId: "stamp",
    name: "モコクマ",
    emoji: "🐻",
    rarity: 2,
    probability: 15,
    description: "ともだちのことをいつも考えるやさしいくまちゃん！",
    bgColor: "from-amber-300 to-orange-400",
    flavorText: "「友達が悲しいとき、一緒にいてあげることが一番の贈り物！」",
  },
  {
    id: "g-stamp-4",
    profileId: "stamp",
    name: "ハナコぱんだ",
    emoji: "🐼",
    rarity: 2,
    probability: 10,
    description: "なんどもあきらめないつよいぱんだっこ！",
    bgColor: "from-gray-300 to-slate-400",
    flavorText: "「失敗はゴールじゃない。次の挑戦への入り口！」",
  },
  {
    id: "g-stamp-5",
    profileId: "stamp",
    name: "ユニコーンぷりん ✦",
    emoji: "🦄",
    rarity: 3,
    probability: 5,
    description: "【超レア！】にじいろのゆにこーん！せいじつさのかみさま！",
    bgColor: "from-pink-400 via-purple-400 to-indigo-400",
    flavorText: "「正直に生きるあなたは、どんな魔法使いより輝いている！」",
  },

  // ===== スタンプガール シール — バトル (rarity 3) =====
  { id: "stamp-bt01", profileId: "stamp", name: "レインボーユニコーン", emoji: "🦄", imagePath: tw("1f984"), rarity: 3, probability: 1, description: "7色に輝くたてがみの伝説のユニコーン！", bgColor: "#12002a", flavorText: "「虹の橋を渡って現れる奇跡のシール！」" },
  { id: "stamp-bt02", profileId: "stamp", name: "プリンセスドラゴン", emoji: "🐉", imagePath: tw("1f409"), rarity: 3, probability: 1, description: "ピンク色の炎を吐くドラゴンのお姫様！", bgColor: "#1a0015", flavorText: "「怖そうだけど実はとってもやさしい！」" },
  { id: "stamp-bt03", profileId: "stamp", name: "まほうの水晶玉", emoji: "🔮", imagePath: tw("1f52e"), rarity: 3, probability: 1, description: "世界中の夢と願いが詰まった神秘の水晶玉！", bgColor: "#0a0018", flavorText: "「見つめると未来が見えてくるかも！」" },
  { id: "stamp-bt04", profileId: "stamp", name: "幻のちょうちょ", emoji: "🦋", imagePath: tw("1f98b"), rarity: 3, probability: 1, description: "月の光だけで生きる幻の蝶！", bgColor: "#0a0820", flavorText: "「触れると幸せな夢が見られる伝説のシール！」" },
  { id: "stamp-bt05", profileId: "stamp", name: "ながれ星の精", emoji: "🌠", imagePath: tw("1f320"), rarity: 3, probability: 1, description: "夜空を駆ける流れ星に宿る精霊！", bgColor: "#010115", flavorText: "「願い事を3つ叶えてくれる超レアシール！」" },
  { id: "stamp-bt06", profileId: "stamp", name: "妖精の女王の冠", emoji: "👑", imagePath: tw("1f451"), rarity: 3, probability: 1, description: "妖精の女王だけが身につけられる黄金の冠！", bgColor: "#1a1000", flavorText: "「全シールの中で最も気高い一枚！」" },

  // ===== スタンプガール シール — レジェンド (rarity 3) =====
  { id: "stamp-lg01", profileId: "stamp", name: "レインボーダイヤ", emoji: "💎", imagePath: tw("1f48e"), rarity: 3, probability: 1, description: "この世に3枚しかない伝説のダイヤモンドシール！", bgColor: "#050520", flavorText: "「見つけたら一生幸せになれるとか！？」" },
  { id: "stamp-lg02", profileId: "stamp", name: "天の川", emoji: "🌌", imagePath: tw("1f30c"), rarity: 3, probability: 1, description: "夏の夜空に輝く天の川を閉じ込めた宇宙最高のシール！", bgColor: "#010112", flavorText: "「持っていると宇宙人の友達ができるかも！？」" },
  { id: "stamp-lg03", profileId: "stamp", name: "まほうのきらめき", emoji: "✨", imagePath: tw("2728"), rarity: 3, probability: 1, description: "まほう使いの杖から飛び出したきらきら光る魔法の粒！", bgColor: "#0e001a", flavorText: "「触れると全身がきらきら輝き出すかも！」" },

  // ===== スタンプガール シール — ウルトラ (rarity 2) =====
  { id: "stamp-u01", profileId: "stamp", name: "フラミンゴ", emoji: "🦩", imagePath: tw("1fa69"), rarity: 2, probability: 2, description: "世界で一番きれいなピンク色の鳥！", bgColor: "#fff0f5", flavorText: "「片足でバランスを取りながら踊るのが得意！」" },
  { id: "stamp-u02", profileId: "stamp", name: "はくちょう", emoji: "🦢", imagePath: tw("1f9a2"), rarity: 2, probability: 2, description: "湖を優雅に泳ぐ白い鳥。天才ダンサー！", bgColor: "#f0f8ff", flavorText: "「どんな水面もバレエのステージに変えてしまう！」" },
  { id: "stamp-u03", profileId: "stamp", name: "花火", emoji: "🎆", imagePath: tw("1f386"), rarity: 2, probability: 2, description: "夜空に咲く大輪の花火！見る人みんなをハッピーに！", bgColor: "#0a0020", flavorText: "「ドーン！パーン！キラキラキラ〜！」" },
  { id: "stamp-u04", profileId: "stamp", name: "ほしの惑星", emoji: "🪐", imagePath: tw("1fa90"), rarity: 2, probability: 2, description: "きれいな輪っかを持つ宇宙の星！", bgColor: "#080820", flavorText: "「輪っかは宇宙のかわいさを集めたリング！」" },
  { id: "stamp-u05", profileId: "stamp", name: "きらきらほし", emoji: "🌟", imagePath: tw("1f31f"), rarity: 2, probability: 2, description: "夜空でひときわ輝く黄金の星！", bgColor: "#201008", flavorText: "「見つけた子に夢のパワーをプレゼント！」" },
  { id: "stamp-u06", profileId: "stamp", name: "まほうの星", emoji: "💫", imagePath: tw("1f4ab"), rarity: 2, probability: 2, description: "流れ星に乗って旅する魔法の星のシール！", bgColor: "#080018", flavorText: "「枕の下に置いて寝ると素敵な夢を見られる！」" },

  // ===== スタンプガール シール — スーパーレア (rarity 2) =====
  { id: "stamp-s01", profileId: "stamp", name: "ちょうちょ", emoji: "🦋", imagePath: tw("1f98b"), rarity: 2, probability: 2, description: "色とりどりの翅を持つ美しい蝶！春の使者！", bgColor: "#f5f0ff", flavorText: "「花から花へ飛び回りながら幸せを運ぶ！」" },
  { id: "stamp-s02", profileId: "stamp", name: "イルカ", emoji: "🐬", imagePath: tw("1f42c"), rarity: 2, probability: 2, description: "海の中で一番賢くて優しい生き物！", bgColor: "#dbeafe", flavorText: "「波の上をジャンプして手を振ってくれる！」" },
  { id: "stamp-s03", profileId: "stamp", name: "カラフルオウム", emoji: "🦜", imagePath: tw("1f99c"), rarity: 2, probability: 2, description: "虹みたいな色をしたポジティブな鳥！", bgColor: "#d1fae5", flavorText: "「「かわいい！」「すごい！」しか言わない！」" },
  { id: "stamp-s04", profileId: "stamp", name: "カワウソ", emoji: "🦦", imagePath: tw("1f9a6"), rarity: 2, probability: 2, description: "手をつないで眠るカワウソのシール！", bgColor: "#ffedd5", flavorText: "「毎日水の中でくるくる回って遊んでいる！」" },
  { id: "stamp-s05", profileId: "stamp", name: "タコちゃん", emoji: "🐙", imagePath: tw("1f419"), rarity: 2, probability: 2, description: "8本の腕でハグしてくれるタコちゃん！", bgColor: "#fce7f3", flavorText: "「頭がとっても良くてジャーを自分で開けられる！」" },
  { id: "stamp-s06", profileId: "stamp", name: "ラブレター", emoji: "💌", imagePath: tw("1f48c"), rarity: 2, probability: 2, description: "ハートのシールが貼られた特別なラブレター！", bgColor: "#ffe4e6", flavorText: "「渡した相手とは一生仲良しになれるとか！」" },
  { id: "stamp-s07", profileId: "stamp", name: "まほうのゆびわ", emoji: "💍", imagePath: tw("1f48d"), rarity: 2, probability: 2, description: "一番の夢を叶えてくれると言われる不思議な指輪！", bgColor: "#eff6ff", flavorText: "「好きな人に送ってみよう！」" },
  { id: "stamp-s08", profileId: "stamp", name: "まほうのつえ", emoji: "🪄", imagePath: tw("1fa84"), rarity: 2, probability: 2, description: "振り回すとキラキラの星が飛び出す杖！", bgColor: "#f5f3ff", flavorText: "「周りを幸せな空間に変えてしまう！」" },
  { id: "stamp-s09", profileId: "stamp", name: "せんこう花火", emoji: "🎇", imagePath: tw("1f387"), rarity: 2, probability: 2, description: "じわじわキラキラ輝く線香花火！夏の思い出！", bgColor: "#0a0020", flavorText: "「消えそうで消えない、その一瞬の美しさ！」" },
  { id: "stamp-s10", profileId: "stamp", name: "まんかいさくら", emoji: "🌸", imagePath: tw("1f338"), rarity: 2, probability: 2, description: "春に満開に咲く桜の花びらのシール！", bgColor: "#fce7f3", flavorText: "「風に舞う花びらの中でいいことが起きそう！」" },
  { id: "stamp-s11", profileId: "stamp", name: "ハイビスカス", emoji: "🌺", imagePath: tw("1f33a"), rarity: 2, probability: 2, description: "真っ赤でゴージャスな南国の花！", bgColor: "#ffe4e6", flavorText: "「見ているだけで南の島にいる気分！」" },
  { id: "stamp-s12", profileId: "stamp", name: "チューリップ", emoji: "🌷", imagePath: tw("1f337"), rarity: 2, probability: 2, description: "ピンク色のかわいいチューリップ！大好きを伝えるプレゼントに！", bgColor: "#fdf2f8", flavorText: "「春になると色とりどりに咲き誇る！」" },
  { id: "stamp-s13", profileId: "stamp", name: "はなたば", emoji: "💐", imagePath: tw("1f490"), rarity: 2, probability: 2, description: "いろんな花を集めた素敵な花束！", bgColor: "#fdf4ff", flavorText: "「「ありがとう」「だいすき」を伝えたいとき！」" },
  { id: "stamp-s14", profileId: "stamp", name: "スペシャルリボン", emoji: "🎀", imagePath: tw("1f380"), rarity: 2, probability: 2, description: "どんなプレゼントにも合う完璧なリボンのシール！", bgColor: "#fdf2f8", flavorText: "「このリボンを付けるだけで最高の贈り物に！」" },
  { id: "stamp-s15", profileId: "stamp", name: "まほうのプレゼント", emoji: "🎁", imagePath: tw("1f381"), rarity: 2, probability: 2, description: "開けるたびに違うものが出てくる不思議なプレゼント！", bgColor: "#fff1f2", flavorText: "「何が入ってるかは開けてからのお楽しみ！」" },
  { id: "stamp-s16", profileId: "stamp", name: "にじ", emoji: "🌈", imagePath: tw("1f308"), rarity: 2, probability: 2, description: "雨上がりの空にかかる7色の橋！", bgColor: "#eff6ff", flavorText: "「見るたびにハッピーになる空のシール！」" },
  { id: "stamp-s17", profileId: "stamp", name: "すい星", emoji: "☄️", imagePath: tw("2604"), rarity: 2, probability: 2, description: "宇宙を駆け抜ける彗星！一生に一度しか見られない！", bgColor: "#06060e", flavorText: "「宇宙のプレゼントがやってきた！」" },
  { id: "stamp-s18", profileId: "stamp", name: "かんらんしゃ", emoji: "🎡", imagePath: tw("1f3a1"), rarity: 2, probability: 2, description: "夜にきらきら光って、昼にカラフルに回る大観覧車！", bgColor: "#fff0f5", flavorText: "「一番上からは世界中が見渡せる！」" },

  // ===== スタンプガール シール — レア (rarity 1) =====
  { id: "stamp-r01", profileId: "stamp", name: "キツネ", emoji: "🦊", imagePath: tw("1f98a"), rarity: 1, probability: 3, description: "オレンジ色のふわふわしっぽを持つキツネ！", bgColor: "#fff7ed", flavorText: "「気まぐれだけどすごく賢くて優しい！」" },
  { id: "stamp-r02", profileId: "stamp", name: "パンダ", emoji: "🐼", imagePath: tw("1f43c"), rarity: 1, probability: 3, description: "白黒のぷっくりした体が可愛いパンダ！", bgColor: "#f9fafb", flavorText: "「一日中タケノコを食べているノンビリ屋さん！」" },
  { id: "stamp-r03", profileId: "stamp", name: "カンガルー", emoji: "🦘", imagePath: tw("1f998"), rarity: 1, probability: 3, description: "お腹のポーチに赤ちゃんを入れて大ジャンプ！", bgColor: "#fef3c7", flavorText: "「ジャンプ力は世界一位！」" },
  { id: "stamp-r04", profileId: "stamp", name: "アルパカ", emoji: "🦙", imagePath: tw("1f999"), rarity: 1, probability: 3, description: "もこもこの毛がたまらなくかわいいアルパカ！", bgColor: "#fdf4ff", flavorText: "「撫でるとずっと幸せな気持ちになれる！」" },
  { id: "stamp-r05", profileId: "stamp", name: "キリン", emoji: "🦒", imagePath: tw("1f992"), rarity: 1, probability: 3, description: "世界一首が長い動物！高い葉っぱも食べられる！", bgColor: "#fefce8", flavorText: "「長い首でほっぺにキスしてくれるって噂も！」" },
  { id: "stamp-r06", profileId: "stamp", name: "ハリネズミ", emoji: "🦔", imagePath: tw("1f994"), rarity: 1, probability: 3, description: "針だらけなのにとっても可愛いハリネズミ！", bgColor: "#ffedd5", flavorText: "「慣れたらふわふわのお腹を見せてくれる！」" },
  { id: "stamp-r07", profileId: "stamp", name: "アライグマ", emoji: "🦝", imagePath: tw("1f99d"), rarity: 1, probability: 3, description: "マスクをかけているみたいなアライグマ！", bgColor: "#f3f4f6", flavorText: "「食べ物を川で洗う几帳面な性格が可愛い！」" },
  { id: "stamp-r08", profileId: "stamp", name: "ペンギン", emoji: "🐧", imagePath: tw("1f427"), rarity: 1, probability: 3, description: "よちよち歩きが可愛いペンギン！友情の塊！", bgColor: "#eff6ff", flavorText: "「みんなで体を寄せ合って温め合う！」" },
  { id: "stamp-r09", profileId: "stamp", name: "ひよこ", emoji: "🐤", imagePath: tw("1f424"), rarity: 1, probability: 3, description: "産まれたばかりの黄色いひよこ！ピヨピヨ！", bgColor: "#fefce8", flavorText: "「お母さんの後をついていく姿がたまらない！」" },
  { id: "stamp-r10", profileId: "stamp", name: "たまごひよこ", emoji: "🐣", imagePath: tw("1f423"), rarity: 1, probability: 3, description: "たまごから今まさに産まれようとしているひよこ！", bgColor: "#fefce8", flavorText: "「世界一かわいい瞬間のシール！」" },
  { id: "stamp-r11", profileId: "stamp", name: "アヒル", emoji: "🦆", imagePath: tw("1f986"), rarity: 1, probability: 3, description: "ガーガー元気に鳴くアヒル！水の上をスイスイ！", bgColor: "#fefce8", flavorText: "「頭の青い羽が特徴！」" },
  { id: "stamp-r12", profileId: "stamp", name: "ねったい魚", emoji: "🐠", imagePath: tw("1f420"), rarity: 1, probability: 3, description: "カラフルな縞模様が美しい熱帯魚！海の宝石！", bgColor: "#eff6ff", flavorText: "「珊瑚礁の中をスイスイ泳ぐ！」" },
  { id: "stamp-r13", profileId: "stamp", name: "ふぐ", emoji: "🐡", imagePath: tw("1f421"), rarity: 1, probability: 3, description: "驚くとパンパンに膨らむぷりぷりのふぐ！", bgColor: "#fce7f3", flavorText: "「怒ってる顔が可愛すぎる！」" },
  { id: "stamp-r14", profileId: "stamp", name: "イカ", emoji: "🦑", imagePath: tw("1f991"), rarity: 1, probability: 3, description: "10本の腕でピュッと速く泳ぐイカ！", bgColor: "#ffe4e6", flavorText: "「青白く光る発光イカは特に神秘的！」" },
  { id: "stamp-r15", profileId: "stamp", name: "ショートケーキ", emoji: "🍰", imagePath: tw("1f370"), rarity: 1, probability: 3, description: "イチゴとクリームがたっぷりの最高のケーキ！", bgColor: "#fce7f3", flavorText: "「誕生日に食べたら全ての願いが叶うシール！」" },
  { id: "stamp-r16", profileId: "stamp", name: "カップケーキ", emoji: "🧁", imagePath: tw("1f9c1"), rarity: 1, probability: 3, description: "カラフルなクリームが山盛りのカップケーキ！", bgColor: "#fdf4ff", flavorText: "「見た目も味も最高！」" },
  { id: "stamp-r17", profileId: "stamp", name: "ロリポップ", emoji: "🍭", imagePath: tw("1f36d"), rarity: 1, probability: 3, description: "くるくる模様が可愛いスティックキャンディ！", bgColor: "#fff1f2", flavorText: "「舐めても舐めてもなくならないまほうのあめ！」" },
  { id: "stamp-r18", profileId: "stamp", name: "キャンディ", emoji: "🍬", imagePath: tw("1f36c"), rarity: 1, probability: 3, description: "ラッピングがかわいいカラフルキャンディ！", bgColor: "#ffe4e6", flavorText: "「好きな子に渡すと友達になれる魔法があるとか！」" },
  { id: "stamp-r19", profileId: "stamp", name: "ドーナツ", emoji: "🍩", imagePath: tw("1f369"), rarity: 1, probability: 3, description: "ストロベリーとチョコのアイシングが美味しそう！", bgColor: "#ffedd5", flavorText: "「穴の向こうにはどんな世界が見えるか！」" },
  { id: "stamp-r20", profileId: "stamp", name: "バースデーケーキ", emoji: "🎂", imagePath: tw("1f382"), rarity: 1, probability: 3, description: "ロウソクの火を吹き消したら夢が叶うケーキ！", bgColor: "#fce7f3", flavorText: "「このシールを持つ人の誕生日はいつでもハッピー！」" },
  { id: "stamp-r21", profileId: "stamp", name: "チョコレート", emoji: "🍫", imagePath: tw("1f36b"), rarity: 1, probability: 3, description: "ビターとミルクが混じり合った最高のチョコ！", bgColor: "#fef3c7", flavorText: "「好きな人に渡すと絶対に喜んでもらえる！」" },
  { id: "stamp-r22", profileId: "stamp", name: "ソフトクリーム", emoji: "🍦", imagePath: tw("1f366"), rarity: 1, probability: 3, description: "くるくる巻いた形がかわいいソフトクリーム！", bgColor: "#fffbeb", flavorText: "「暑い日のヒーロー！溶ける前に食べよう！」" },
  { id: "stamp-r23", profileId: "stamp", name: "かき氷", emoji: "🍧", imagePath: tw("1f367"), rarity: 1, probability: 3, description: "カラフルなシロップたっぷりのかき氷！", bgColor: "#eff6ff", flavorText: "「ブルーハワイ・いちご・レモン…何味にする？」" },
  { id: "stamp-r24", profileId: "stamp", name: "アイスクリーム", emoji: "🍨", imagePath: tw("1f368"), rarity: 1, probability: 3, description: "ピンク色のカップに盛られたストロベリーアイス！", bgColor: "#fce7f3", flavorText: "「かわいすぎて食べられないかも？でも食べたい！」" },
  { id: "stamp-r25", profileId: "stamp", name: "いちご", emoji: "🍓", imagePath: tw("1f353"), rarity: 1, probability: 3, description: "真っ赤でつやつや光るいちご！甘酸っぱい！", bgColor: "#fff1f2", flavorText: "「いちごが好きな人は、みんなから愛される！」" },
  { id: "stamp-r26", profileId: "stamp", name: "さくらんぼ", emoji: "🍒", imagePath: tw("1f352"), rarity: 1, probability: 3, description: "ふたつがくっついたかわいいさくらんぼ！", bgColor: "#ffe4e6", flavorText: "「「ふたりでいつまでも一緒に」の意味がある！」" },
  { id: "stamp-r27", profileId: "stamp", name: "もも", emoji: "🍑", imagePath: tw("1f351"), rarity: 1, probability: 3, description: "ふっくらまんまるのピーチ！桃太郎が産まれた桃かも！", bgColor: "#ffedd5", flavorText: "「食べると強くなれるとか、お肌がつるつるになるとか！」" },
  { id: "stamp-r28", profileId: "stamp", name: "ぶどう", emoji: "🍇", imagePath: tw("1f347"), rarity: 1, probability: 3, description: "ひと粒ひと粒が宝石みたいに輝くぶどう！", bgColor: "#faf5ff", flavorText: "「友達と分け合うと何倍も美味しくなる！」" },
  { id: "stamp-r29", profileId: "stamp", name: "ハートリボン", emoji: "💝", imagePath: tw("1f49d"), rarity: 1, probability: 3, description: "赤いハートと可愛いリボンのコンビ！", bgColor: "#ffe4e6", flavorText: "「贈った相手と永遠の友達になれる伝説がある！」" },
  { id: "stamp-r30", profileId: "stamp", name: "ひまわり", emoji: "🌻", imagePath: tw("1f33b"), rarity: 1, probability: 3, description: "太陽に向かって元気いっぱい咲くひまわり！", bgColor: "#fefce8", flavorText: "「このシールを持つ人はいつも前向きで明るい！」" },

  // ===== スタンプガール シール — ノーマル (rarity 1) =====
  { id: "stamp-c01", profileId: "stamp", name: "ネコ", emoji: "🐱", imagePath: tw("1f431"), rarity: 1, probability: 4, description: "ゴロゴロしながらひなたぼっこが大好きなネコ！", bgColor: "#fce7f3", flavorText: "「気まぐれだけど名前を呼ぶと振り向いてくれる！」" },
  { id: "stamp-c02", profileId: "stamp", name: "ウサギ", emoji: "🐰", imagePath: tw("1f430"), rarity: 1, probability: 4, description: "ぴょんぴょん跳ねる可愛いウサギ！", bgColor: "#fdf2f8", flavorText: "「月でお餅をついているウサギかも？」" },
  { id: "stamp-c03", profileId: "stamp", name: "クマ", emoji: "🐻", imagePath: tw("1f43b"), rarity: 1, probability: 4, description: "ふかふかのお腹でハグしてくれるクマ！", bgColor: "#fef3c7", flavorText: "「ハチミツが大好きで冬はぐっすり眠る！」" },
  { id: "stamp-c04", profileId: "stamp", name: "イヌ", emoji: "🐶", imagePath: tw("1f436"), rarity: 1, probability: 4, description: "しっぽをブンブン振って出迎えてくれる最高の友達！", bgColor: "#fffbeb", flavorText: "「世界中で一番人間のことが好きな動物！」" },
  { id: "stamp-c05", profileId: "stamp", name: "ハムスター", emoji: "🐹", imagePath: tw("1f439"), rarity: 1, probability: 4, description: "ほっぺにえさをパンパンに詰めるハムスター！", bgColor: "#ffedd5", flavorText: "「回し車が大好き！くりくりの目がたまらない！」" },
  { id: "stamp-c06", profileId: "stamp", name: "ネズミ", emoji: "🐭", imagePath: tw("1f42d"), rarity: 1, probability: 4, description: "小さくてちょこちょこ動くネズミ！チーズが大好き！", bgColor: "#f9fafb", flavorText: "「大きなネコにも負けないチャレンジャー精神！」" },
  { id: "stamp-c07", profileId: "stamp", name: "カエル", emoji: "🐸", imagePath: tw("1f438"), rarity: 1, probability: 4, description: "雨の日になるとゲロゲロと元気に鳴くカエル！", bgColor: "#f0fdf4", flavorText: "「「かえる」は無事に帰れる縁起のいい動物！」" },
  { id: "stamp-c08", profileId: "stamp", name: "ブタ", emoji: "🐷", imagePath: tw("1f437"), rarity: 1, probability: 4, description: "くるんとしたしっぽがキュートなブタ！", bgColor: "#fce7f3", flavorText: "「頭が良くて名前を呼ぶと返事をする！」" },
  { id: "stamp-c09", profileId: "stamp", name: "ウシ", emoji: "🐮", imagePath: tw("1f42e"), rarity: 1, probability: 4, description: "白と黒の模様がかわいいウシ！牛乳をくれる優しい動物！", bgColor: "#eff6ff", flavorText: "「のんびりした優しいウシのシール！」" },
  { id: "stamp-c10", profileId: "stamp", name: "トラ", emoji: "🐯", imagePath: tw("1f42f"), rarity: 1, probability: 4, description: "ストライプ模様がかっこいいトラ！実は泳ぎが得意！", bgColor: "#fffbeb", flavorText: "「水遊びが大好きな意外とかわいい一面がある！」" },
  { id: "stamp-c11", profileId: "stamp", name: "はな", emoji: "🌼", imagePath: tw("1f33c"), rarity: 1, probability: 4, description: "春になると一斉に咲く黄色いかわいいお花！", bgColor: "#fefce8", flavorText: "「このシールを見るたびに暖かい春の日差しを思い出す！」" },
  { id: "stamp-c12", profileId: "stamp", name: "よつばのクローバー", emoji: "🍀", imagePath: tw("1f340"), rarity: 1, probability: 4, description: "見つけたら幸運が訪れる四つ葉のクローバー！", bgColor: "#f0fdf4", flavorText: "「四つ葉を見つけたあなたはラッキー！」" },
  { id: "stamp-c13", profileId: "stamp", name: "つき", emoji: "🌙", imagePath: tw("1f319"), rarity: 1, probability: 4, description: "夜空に浮かぶ三日月のシール！", bgColor: "#1e1b4b", flavorText: "「お月様の上でウサギがお餅をついている！」" },
  { id: "stamp-c14", profileId: "stamp", name: "ほし", emoji: "⭐", imagePath: tw("2b50"), rarity: 1, probability: 4, description: "夜空に輝くお星様のシール！", bgColor: "#fefce8", flavorText: "「眠れない夜は星に向かってお願い事を！」" },
  { id: "stamp-c15", profileId: "stamp", name: "レモン", emoji: "🍋", imagePath: tw("1f34b"), rarity: 1, probability: 4, description: "酸っぱいのにかわいい黄色いレモン！", bgColor: "#fefce8", flavorText: "「元気がない日には特に効果抜群！」" },
  { id: "stamp-c16", profileId: "stamp", name: "りんご", emoji: "🍎", imagePath: tw("1f34e"), rarity: 1, probability: 4, description: "真っ赤に熟れた美味しそうなりんご！", bgColor: "#fff1f2", flavorText: "「一日一個で医者いらずって本当らしい！」" },
  { id: "stamp-c17", profileId: "stamp", name: "みかん", emoji: "🍊", imagePath: tw("1f34a"), rarity: 1, probability: 4, description: "コタツでみかんを食べるのが最高の幸せ！", bgColor: "#fff7ed", flavorText: "「甘くてジューシー、皮を剥くときの香りが最高！」" },
  { id: "stamp-c18", profileId: "stamp", name: "パイナップル", emoji: "🍍", imagePath: tw("1f34d"), rarity: 1, probability: 4, description: "王冠みたいな葉っぱを持つパイナップル！", bgColor: "#fefce8", flavorText: "「甘くて酸っぱい南国フルーツ！」" },
  { id: "stamp-c19", profileId: "stamp", name: "すいか", emoji: "🍉", imagePath: tw("1f349"), rarity: 1, probability: 4, description: "緑と黒の縞模様が特徴のすいか！夏のビーチで食べよう！", bgColor: "#f0fdf4", flavorText: "「種を飛ばすゲームも最高に楽しい！」" },
  { id: "stamp-c20", profileId: "stamp", name: "バナナ", emoji: "🍌", imagePath: tw("1f34c"), rarity: 1, probability: 4, description: "黄色くて曲がったかわいいバナナ！サルが大好き！", bgColor: "#fefce8", flavorText: "「剥いたあとの皮を踏むと滑る…というのは昔話かも？」" },
  { id: "stamp-c21", profileId: "stamp", name: "なし", emoji: "🍐", imagePath: tw("1f350"), rarity: 1, probability: 4, description: "みずみずしくてシャキシャキの梨！夏の終わりの風物詩！", bgColor: "#f7fee7", flavorText: "「お盆が近づくとスーパーに並ぶ懐かしいフルーツ！」" },
  { id: "stamp-c22", profileId: "stamp", name: "キウイ", emoji: "🥝", imagePath: tw("1f95d"), rarity: 1, probability: 4, description: "外はモコモコ、中は緑色のキウイ！", bgColor: "#f7fee7", flavorText: "「ビタミンCたっぷりでお肌にも良い！」" },
  { id: "stamp-c23", profileId: "stamp", name: "ブルーベリー", emoji: "🫐", imagePath: tw("1fad0"), rarity: 1, probability: 4, description: "丸くてつやつやの紫色のブルーベリー！目に良い！", bgColor: "#eff6ff", flavorText: "「ヨーグルトに入れると最高！」" },
  { id: "stamp-c24", profileId: "stamp", name: "マンゴー", emoji: "🥭", imagePath: tw("1f96d"), rarity: 1, probability: 4, description: "南国の太陽をたっぷり浴びて育ったマンゴー！", bgColor: "#fffbeb", flavorText: "「甘くてとろとろ、フルーツの王様！」" },
];

export type GachaPullResult = {
  character: GachaCharacter;
  isNew: boolean;
};

/**
 * Pull a gacha character from the available pool (excluding already-owned ones).
 * Uses weighted random. If all characters are owned, returns null.
 */
export function pullGacha(
  profileId: "mushi" | "stamp",
  ownedIds: string[]
): GachaPullResult | null {
  const pool = GACHA_CHARACTERS.filter(
    (c) => c.profileId === profileId && !ownedIds.includes(c.id)
  );

  if (pool.length === 0) return null;

  // Normalize probabilities for remaining pool
  const total = pool.reduce((sum, c) => sum + c.probability, 0);
  let rand = Math.random() * total;

  for (const character of pool) {
    rand -= character.probability;
    if (rand <= 0) {
      return { character, isNew: true };
    }
  }

  // Fallback
  return { character: pool[pool.length - 1], isNew: true };
}

export const RARITY_LABELS: Record<GachaRarity, string> = {
  1: "★",
  2: "★★",
  3: "★★★",
};

export const RARITY_COLORS: Record<GachaRarity, string> = {
  1: "text-gray-500",
  2: "text-blue-500",
  3: "text-yellow-600",
};

export const RARITY_BG: Record<GachaRarity, string> = {
  1: "bg-white border-gray-200",
  2: "bg-blue-50 border-blue-200",
  3: "bg-yellow-50 border-yellow-300",
};
