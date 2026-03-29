export type QuizQuestion = {
  type: "multiple_choice" | "true_false" | "inference";
  question: string;
  options: string[];
  correctIndex: number; // -1 means inference (reflection, no wrong answer)
  explanation?: string;
  points: number; // coins awarded for correct answer (inference always awarded)
};

export type StoryPage = {
  text: string;
  emoji: string;
};

export type StoryChoice = {
  afterPage: number; // show choice UI after this page (0-indexed)
  question: string;
  options: { label: string; emoji: string; resultPage: StoryPage }[];
};

export type Story = {
  id: string;
  profileId: "mushi" | "stamp";
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  pages: StoryPage[];
  moral: string;
  quiz: QuizQuestion[];
  stickerEmoji: string;
  stickerName: string;
  readCoins: number; // coins for completing story
  readXp: number; // XP for completing story
  choicePoint?: StoryChoice; // optional branching narrative
};

export type Profile = {
  id: "mushi" | "stamp";
  name: string;
  fullName: string;
  grade: string;
  emoji: string;
  mascot: string;
  bgColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  buttonColor: string;
  description: string;
  stickerLabel: string;
};

export const PROFILES: Profile[] = [
  {
    id: "mushi",
    name: "むしはかせ",
    fullName: "むしはかせコース",
    grade: "小学2年生",
    emoji: "🐛",
    mascot: "🔬",
    bgColor: "bg-green-50",
    bgGradient: "from-green-400 to-emerald-600",
    textColor: "text-green-800",
    accentColor: "bg-green-500",
    buttonColor: "bg-green-500 hover:bg-green-600",
    description: "むしのなかまたちと大ぼうけん！",
    stickerLabel: "むしシール",
  },
  {
    id: "stamp",
    name: "スタンプガール",
    fullName: "スタンプガールコース",
    grade: "小学4年生",
    emoji: "🌸",
    mascot: "⭐",
    bgColor: "bg-pink-50",
    bgGradient: "from-pink-400 to-rose-500",
    textColor: "text-pink-800",
    accentColor: "bg-pink-500",
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    description: "かわいいなかまとステキなぼうけん！",
    stickerLabel: "かわいいシール",
  },
];

export const STORIES: Story[] = [
  // ===== むしはかせ Stories =====
  {
    id: "mushi-1",
    profileId: "mushi",
    title: "ありさんのチームワーク",
    subtitle: "みんなで力を合わせると、大きなことができる！",
    emoji: "🐜",
    color: "bg-yellow-100 border-yellow-300",
    pages: [
      {
        text: "むかしむかし、大きな森の中に、小さなアリたちが住んでいました。\nある夏の日、アリたちは大きなパンのかけらを見つけました。\nでも、そのパンはとても重くて、一匹では全然動かせません。",
        emoji: "🌳",
      },
      {
        text: "「うーん、重たいなあ」とアリの一匹がつぶやきました。\n「そうだ！みんなを呼んでこよう！」\nアリは仲間たちのところへ走っていきました。",
        emoji: "🐜",
      },
      {
        text: "「みんな、力を貸してください！\nひとりではムリでも、みんなでやれば絶対できる！」\nアリたちは元気よく「わかった！」と返事しました。",
        emoji: "🗣️",
      },
      {
        text: "十匹のアリが集まって、パンのまわりに並びました。\n「いっせーの…せ！」\nすると、重かったパンがゆっくりと動き始めたのです！",
        emoji: "💪",
      },
      {
        text: "みんなで力を合わせると、どんな大きなパンでも運べました。\nその夜、アリたちはみんなで美味しいパンをたべました。\n「やっぱりみんなでやると楽しいね！」と笑顔が広がりました。",
        emoji: "🍞",
      },
    ],
    moral: "みんなで力を合わせると、ひとりではできないことでも、できるようになります。困ったときは、仲間に声をかけてみよう！",
    quiz: [
      {
        type: "multiple_choice",
        question: "アリたちは何を見つけましたか？",
        options: ["おにぎり", "大きなパンのかけら", "きのこ", "どんぐり"],
        correctIndex: 1,
        explanation: "アリたちは大きなパンのかけらを見つけました！",
        points: 15,
      },
      {
        type: "true_false",
        question: "アリは一匹でも大きなパンを運べた。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "一匹では重くて動かせなかったから、仲間を呼んだんだよ！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "この話から学べることは何ですか？",
        options: ["パンはおいしい", "アリは小さい", "仲間と協力することが大切", "森は大きい"],
        correctIndex: 2,
        explanation: "そう！みんなで力を合わせることが大切なんだね！",
        points: 20,
      },
      {
        type: "inference",
        question: "もしあなたが重い荷物を持てなくて困っていたら、どうする？",
        options: [
          "絶対に友達に頼む！みんなで助け合うのが大切",
          "まず自分で頑張ってみてから、ダメなら相談する",
          "大人に助けてもらう",
          "困っても誰にも言わず我慢する",
        ],
        correctIndex: -1,
        explanation: "どれも考えられるね！困ったとき誰かに頼れることって、とっても大事なことだよ。",
        points: 20,
      },
    ],
    stickerEmoji: "🐜",
    stickerName: "チームアリシール",
    readCoins: 500,
    readXp: 100,
    choicePoint: {
      afterPage: 2, // after page 3 (index 2) — アリたちが集まった場面
      question: "さあ、どうやってパンを運ぼう？",
      options: [
        {
          label: "みんなで一緒に押す！",
          emoji: "💪",
          resultPage: {
            text: "アリたちは全員でパンをぐるっと囲みました。\n「いっせーのーせ！」みんなで押すと、\nパンがゴロゴロ転がっていきました！「やったー！！」",
            emoji: "🙌",
          },
        },
        {
          label: "リーダーが前に立つ！",
          emoji: "🏅",
          resultPage: {
            text: "一番力持ちのアリが先頭に立ちました。\n「みんな、ぼくについてきて！」\nリーダーが引っ張り、みんなが後ろから押すと\nパンはどんどん進んでいきました！",
            emoji: "⭐",
          },
        },
      ],
    },
  },
  {
    id: "mushi-2",
    profileId: "mushi",
    title: "チョウチョになるまで",
    subtitle: "どんな小さな命も、かならず輝ける！",
    emoji: "🦋",
    color: "bg-purple-100 border-purple-300",
    pages: [
      {
        text: "小さな青虫のモコは、葉っぱの上でひっそり暮らしていました。\n「ぼくはいつも葉っぱしか食べられないし、どこにも飛んでいけない。\nいいなあ、鳥さんは空を自由に飛べて…」",
        emoji: "🐛",
      },
      {
        text: "ある日、おばあちゃんのチョウチョが話しかけました。\n「モコ、あなたもいつかきっと飛べる日が来るよ」\n「え？ぼくが？」モコは信じられませんでした。",
        emoji: "🦋",
      },
      {
        text: "「まずは、毎日しっかり葉っぱを食べてね。\nそして、大事な時が来たら、さなぎになって待つの。\nどんな姿でも、あなたはあなたよ」",
        emoji: "🍃",
      },
      {
        text: "モコはたくさん食べてさなぎになりました。\n暗くて狭くて、少し怖かったけれど、\n「おばあちゃんを信じよう」と待ち続けました。",
        emoji: "🫘",
      },
      {
        text: "ある朝、さなぎが割れました。\n中から出てきたのは…きれいな羽を持つチョウチョ！\n「飛べた！ぼくも飛べた！」\nモコは青い空へ、高く高く舞い上がりました。",
        emoji: "🦋",
      },
    ],
    moral: "今は小さくても、弱くても、あきらめないで。コツコツ続けていれば、きっと自分だけの輝く時が来ます。変わることを怖がらないで！",
    quiz: [
      {
        type: "multiple_choice",
        question: "モコはどんな生き物でしたか？",
        options: ["カブトムシ", "青虫", "チョウチョ", "バッタ"],
        correctIndex: 1,
        explanation: "モコは小さな青虫でした。でも最後にチョウチョになれたね！",
        points: 15,
      },
      {
        type: "true_false",
        question: "モコはさなぎになるのが楽しみで全然こわくなかった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "「暗くて狭くて、少し怖かった」と書いてあったね。怖くても頑張ったモコはすごい！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "モコが飛べるようになるために必要だったことは？",
        options: ["鳥に頼む", "大きくジャンプする", "さなぎになって待つ", "木を登る"],
        correctIndex: 2,
        explanation: "さなぎになって待つことが大事でした。待つことにも勇気がいるね！",
        points: 20,
      },
      {
        type: "inference",
        question: "今できないことがあっても、どんな気持ちでいたいですか？",
        options: [
          "「いつかできる！」とわくわくしながら練習する",
          "「今は準備中」と思ってゆっくり待つ",
          "「みんな最初はできないよね」と思って焦らない",
          "「絶対あきらめない！」と毎日がんばる",
        ],
        correctIndex: -1,
        explanation: "どの気持ちも大切！モコみたいに信じて待てる心を持とうね。",
        points: 20,
      },
    ],
    stickerEmoji: "🦋",
    stickerName: "ちょうちょシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "mushi-3",
    profileId: "mushi",
    title: "ホタルのやさしい光",
    subtitle: "小さな力でも、誰かを照らすことができる！",
    emoji: "✨",
    color: "bg-blue-100 border-blue-300",
    pages: [
      {
        text: "川のそばに住むホタルのヒカルは、自分の光をはずかしく思っていました。\n「ぼくの光、小さいし弱いし…何の役にも立たないよ」\nヒカルはいつも一人でいました。",
        emoji: "✨",
      },
      {
        text: "ある夜、暗い森の中で、小さなカエルが泣いていました。\n「こわいよ、真っ暗でどこにいるかわからない…」\nヒカルは思わず近づいて光りました。",
        emoji: "🐸",
      },
      {
        text: "「あ、光だ！」カエルが顔を上げました。\n「ありがとう！おかげで道がわかったよ！」\nヒカルはびっくりしました。「ぼくの光で助けられたの？」",
        emoji: "🌙",
      },
      {
        text: "すると、他のホタルたちも集まってきて、\nみんなで光り始めると、森全体がぼんやり明るくなりました。\n小さな光が集まって、大きな輝きになったのです。",
        emoji: "🌟",
      },
      {
        text: "「ヒカル、あなたの光があったから、みんな集まれたよ」\n仲間が言いました。\nヒカルはやっとわかりました。どんなに小さくても、\n自分の光には意味があるということを。",
        emoji: "💡",
      },
    ],
    moral: "自分の力は小さいと思っていても、誰かのために使えば大きな力になります。自分を信じて、勇気を出して一歩踏み出してみよう！",
    quiz: [
      {
        type: "multiple_choice",
        question: "ヒカルが助けたのは誰でしたか？",
        options: ["アリ", "カブトムシ", "小さなカエル", "バッタ"],
        correctIndex: 2,
        explanation: "暗い森で泣いていた小さなカエルを助けたよ！",
        points: 15,
      },
      {
        type: "true_false",
        question: "ヒカルはホタルのなかまと一緒に光り続けた。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 0,
        explanation: "みんなで光り合って、森全体が明るくなったんだね！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "ヒカルが学んだことは何ですか？",
        options: [
          "夜は暗い",
          "カエルは泣く",
          "小さな光でも誰かの役に立てる",
          "森は怖い",
        ],
        correctIndex: 2,
        explanation: "そう！どんな小さな力でも、誰かを助けられるんだね！",
        points: 20,
      },
      {
        type: "inference",
        question: "自分の「ちょっと得意なこと」は何ですか？それで誰かを助けられそう？",
        options: [
          "絵が好き→友達の誕生日カードを描いてあげる",
          "算数が得意→困っている友達に教えてあげる",
          "話を聞くのが得意→悩んでいる友達の話を聞く",
          "元気が得意→みんなを笑顔にする！",
        ],
        correctIndex: -1,
        explanation: "どれも素晴らしい！自分の得意なことで誰かを助けるって最高だよ！",
        points: 20,
      },
    ],
    stickerEmoji: "✨",
    stickerName: "ホタルシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "mushi-4",
    profileId: "mushi",
    title: "カブトムシとクワガタのけんか",
    subtitle: "ちがいを認め合えば、いちばんの仲良しになれる！",
    emoji: "🪲",
    color: "bg-amber-100 border-amber-300",
    pages: [
      {
        text: "森の一番大きな木の樹液をめぐって、カブトムシとクワガタが毎日けんかをしていました。\n「ぼくのほうが強い！」\n「いや、ぼくのほうが強い！」\nふたりは仲良くなれませんでした。",
        emoji: "🪲",
      },
      {
        text: "ある日、大雨が降って木が倒れてしまいました。\n樹液はなくなり、ふたりは困ってしまいました。\n「これからどうしよう…」お互いに心配そうです。",
        emoji: "🌧️",
      },
      {
        text: "クワガタが言いました。「ぼくは木を切るのが得意だよ。\n新しい木を見つけよう」\nカブトムシが言いました。「ぼくは土を掘るのが得意！\n木の根っこを探せるよ」",
        emoji: "💬",
      },
      {
        text: "ふたりは力を合わせて、もっと甘い樹液の出る木を見つけました。\n「ひとりじゃ絶対見つけられなかった」\n「ぼくたち、ちがうところがあるから、一緒だと最強だね！」",
        emoji: "🤝",
      },
      {
        text: "それからカブトムシとクワガタは仲良しになりました。\nちがうから競争していたけれど、\nちがうから助け合えることもあるってわかったのです。",
        emoji: "🌟",
      },
    ],
    moral: "自分と違うからといって、争う必要はありません。違いがあるから、お互いに補い合えることがあります。違いは弱さじゃなく、強さです！",
    quiz: [
      {
        type: "multiple_choice",
        question: "カブトムシとクワガタは何でけんかしていましたか？",
        options: ["木の実", "樹液", "巣の場所", "虫の友達"],
        correctIndex: 1,
        explanation: "木の樹液をめぐってけんかしていたんだね。",
        points: 15,
      },
      {
        type: "true_false",
        question: "カブトムシが得意なのは木を切ることだ。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "カブトムシは土を掘るのが得意！木を切るのはクワガタだよ。",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "ふたりはどうして仲良しになれましたか？",
        options: [
          "どちらかが謝った",
          "ちがいを活かして協力した",
          "先生に言われた",
          "プレゼントをもらった",
        ],
        correctIndex: 1,
        explanation: "それぞれの違う得意なことを活かして協力したから仲良しになれたんだ！",
        points: 20,
      },
      {
        type: "inference",
        question: "自分と違う好みや得意なことを持つ友達がいたら、どう思う？",
        options: [
          "おもしろい！違いがあると一緒にいろんなことができる",
          "最初は戸惑うけど、話してみると仲良くなれそう",
          "どちらが正しいか話し合ってみたい",
          "違いを認め合えれば最高の友達になれる！",
        ],
        correctIndex: -1,
        explanation: "みんな違って、みんないい！違いこそが最大の力になるんだよ。",
        points: 20,
      },
    ],
    stickerEmoji: "🪲",
    stickerName: "カブトシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "mushi-5",
    profileId: "mushi",
    title: "ミツバチのすてきな一日",
    subtitle: "コツコツ続けることが、大切なものを生み出す！",
    emoji: "🐝",
    color: "bg-orange-100 border-orange-300",
    pages: [
      {
        text: "ミツバチのハナは毎朝早く起きて、お花のみつを集めていました。\n「今日も頑張るぞ！」\nとなりに住むバッタのピョンは言いました。\n「そんなに毎日働かなくてもいいじゃないか」",
        emoji: "🐝",
      },
      {
        text: "「でも、コツコツやらないと、冬のごはんがなくなっちゃうもん」\nハナは笑顔で答えて、またみつを集めに飛んでいきました。\nピョンは「めんどうだな〜」と昼寝を続けました。",
        emoji: "🌸",
      },
      {
        text: "夏の間、ハナはせっせとみつを集め続けました。\n少しずつ、少しずつ、巣にはちみつが溜まっていきました。\n「今日も少し増えた！やったー！」",
        emoji: "🍯",
      },
      {
        text: "秋になって、お花がなくなりました。\nピョンは「あ、食べ物がない…」とあわてました。\nハナの巣には、夏の間に集めた、たくさんのはちみつが！",
        emoji: "🍂",
      },
      {
        text: "ハナはピョンにはちみつを分けてあげました。\n「少しずつでも続けることが大切なんだよ」\nピョンは「来年は僕も頑張る！」と目を輝かせました。",
        emoji: "🤗",
      },
    ],
    moral: "大きなことは、小さなことの積み重ねでできています。毎日少しずつでも、コツコツ続けることが大切です。今日の小さな努力が、将来の宝物になります！",
    quiz: [
      {
        type: "multiple_choice",
        question: "ハナは毎日何をしていましたか？",
        options: ["昼寝をする", "はちみつを食べる", "花のみつを集める", "バッタと遊ぶ"],
        correctIndex: 2,
        explanation: "毎朝早く起きて、お花のみつを集めていたんだね！",
        points: 15,
      },
      {
        type: "true_false",
        question: "ピョンは秋になっても食べ物がたっぷりあった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "ピョンは「食べ物がない！」と焦ってしまったんだよ。夏に頑張ったかどうかの差が出たね。",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "この話が教えてくれることは何ですか？",
        options: [
          "バッタは眠り好き",
          "はちみつはおいしい",
          "コツコツ続けることが大切",
          "花はきれい",
        ],
        correctIndex: 2,
        explanation: "毎日少しずつの積み重ねが大切なんだね！",
        points: 20,
      },
      {
        type: "inference",
        question: "毎日コツコツ続けていることや、これから頑張りたいことは何ですか？",
        options: [
          "読書！毎日1冊読んで知識を増やしたい",
          "練習！スポーツや楽器を上手くなりたい",
          "勉強！積み重ねで賢くなりたい",
          "お手伝い！毎日家族を笑顔にしたい",
        ],
        correctIndex: -1,
        explanation: "どれも素晴らしい！今日の小さな努力が、必ず未来の宝物になるよ！",
        points: 20,
      },
    ],
    stickerEmoji: "🐝",
    stickerName: "ミツバチシール",
    readCoins: 500,
    readXp: 100,
  },

  // ===== スタンプガール Stories =====
  {
    id: "stamp-1",
    profileId: "stamp",
    title: "うさぎちゃんのやさしさ",
    subtitle: "思いやりの心が、世界を明るくする！",
    emoji: "🐰",
    color: "bg-pink-100 border-pink-300",
    pages: [
      {
        text: "ピンクのリボンをつけたうさぎのサクラは、\n毎日森の中をスキップしながら帰っていました。\nある日、道の真ん中で小さなハリネズミが泣いていました。",
        emoji: "🐰",
      },
      {
        text: "「どうしたの？」サクラは聞きました。\n「ぼく、迷子になっちゃった…おうちに帰れない」\nハリネズミはぽろぽろ涙をこぼしました。",
        emoji: "🦔",
      },
      {
        text: "サクラは少し迷いました。自分のうちまで遠回りになる…\nでも「このままにはできない！」と思いました。\n「いっしょに探してあげるよ！」",
        emoji: "💗",
      },
      {
        text: "サクラはハリネズミのお家を探してあげました。\nずいぶん遠くまで歩いて、やっとお家が見つかりました。\n「ありがとう、サクラちゃん！」ハリネズミは大喜び。",
        emoji: "🏠",
      },
      {
        text: "サクラが自分のお家に帰ると、もう夕方でした。\nでも、心はとても温かくて、幸せな気持ちでいっぱいでした。\n「誰かのために何かするって、こんなに嬉しいんだな」",
        emoji: "🌅",
      },
    ],
    moral: "人のために時間や力を使うことは、自分も幸せにしてくれます。思いやりの気持ちを持って、困っている人に手をさしのべよう！",
    quiz: [
      {
        type: "multiple_choice",
        question: "サクラが道で出会ったのは誰ですか？",
        options: ["ネコ", "クマ", "小さなハリネズミ", "キツネ"],
        correctIndex: 2,
        explanation: "小さなハリネズミが迷子になって泣いていたんだね。",
        points: 15,
      },
      {
        type: "true_false",
        question: "サクラはハリネズミを助けることをすぐに決めた。少しも迷わなかった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "「遠回りになる…」と迷ったけど、「このままにはできない！」と決意したんだよ。迷いながらも助けたのがすごい！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "遠回りして帰ったサクラはどんな気持ちでしたか？",
        options: [
          "疲れて怒った",
          "悲しい気持ち",
          "心が温かくて幸せ",
          "何も感じなかった",
        ],
        correctIndex: 2,
        explanation: "人のために何かすると、自分も幸せな気持ちになれるんだね！",
        points: 20,
      },
      {
        type: "inference",
        question: "あなたが困っている人を見かけたとき、どんな気持ちになりますか？",
        options: [
          "すぐに「助けたい！」という気持ちになる",
          "助けたいけど、どうすればいいかわからなくてドキドキする",
          "まず大人に知らせてから一緒に助ける",
          "自分が助けられるか心配になるが、勇気を出す",
        ],
        correctIndex: -1,
        explanation: "どんな気持ちでも、思いやりの心があれば大丈夫！サクラみたいに勇気を出してみよう。",
        points: 20,
      },
    ],
    stickerEmoji: "🐰",
    stickerName: "うさぎシール",
    readCoins: 500,
    readXp: 100,
    choicePoint: {
      afterPage: 2, // サクラが迷った場面
      question: "もしあなたがサクラだったら、どうする？",
      options: [
        {
          label: "すぐに「いっしょに行くよ！」と言う",
          emoji: "💗",
          resultPage: {
            text: "「まかせて！いっしょに探そう！」サクラは笑顔で手をつなぎました。\nハリネズミはほっとして、涙が少し止まりました。\n「ありがとう…やさしいね」とハリネズミは言いました。",
            emoji: "🤝",
          },
        },
        {
          label: "そっと声をかけて、一緒に大人を探す",
          emoji: "🧑‍🤝‍🧑",
          resultPage: {
            text: "「大丈夫？ぼくの知ってる大人のところに行こう」\nサクラはそっとハリネズミに寄り添いました。\n「ひとりじゃないよ」その言葉で、ハリネズミは泣き止みました。",
            emoji: "🫂",
          },
        },
      ],
    },
  },
  {
    id: "stamp-2",
    profileId: "stamp",
    title: "ねこちゃんと迷子の子ネコ",
    subtitle: "勇気を出して助けを求めることは、恥ずかしくない！",
    emoji: "🐱",
    color: "bg-violet-100 border-violet-300",
    pages: [
      {
        text: "ミミは元気なネコの女の子。\nある日、公園で小さな子ネコが一人でいるのを見つけました。\n「どうしたの？」と声をかけると、子ネコは震えていました。",
        emoji: "🐱",
      },
      {
        text: "「お母さんとはぐれちゃった。でも知らない人に声をかけるのが怖くて…」\nミミは言いました。「大丈夫。わたしも最初は怖かった。\nでも、助けを求めることって、とっても大切なんだよ」",
        emoji: "🥺",
      },
      {
        text: "ミミは子ネコの手を取って、森のみんなに声をかけました。\n「この子のお母さん、見た人いますか？」\n最初は恥ずかしかったけれど、勇気を出して叫びました。",
        emoji: "📢",
      },
      {
        text: "すると、向こうから必死に走ってくるネコのお母さんが！\n「チビ！良かった〜！」お母さんは子ネコを抱きしめました。\n「ありがとう、ミミちゃん。助けてくれて本当にありがとう」",
        emoji: "🤗",
      },
      {
        text: "ミミは笑顔でうなずきました。\n「困ったときは、勇気を出して声を上げていいんだよ。\nみんなが助けてくれるから」\n子ネコも笑って、うなずきました。",
        emoji: "🌈",
      },
    ],
    moral: "困ったときに助けを求めることは、弱さじゃありません。勇気のいることです。そして、誰かが助けを求めていたら、手をさしのべてあげましょう！",
    quiz: [
      {
        type: "multiple_choice",
        question: "子ネコはなぜ一人でいましたか？",
        options: ["遊びたかったから", "お母さんとはぐれたから", "家出したから", "散歩中だったから"],
        correctIndex: 1,
        explanation: "お母さんとはぐれてしまって、怖くて声もかけられなかったんだね。",
        points: 15,
      },
      {
        type: "true_false",
        question: "ミミは声をかけることが最初から全然恥ずかしくなかった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "「最初は恥ずかしかったけれど、勇気を出して」と書いてあったよ。恥ずかしくても頑張ったのがえらい！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "ミミが学んだことは何ですか？",
        options: [
          "公園は危ない",
          "ネコは速い",
          "困ったときは勇気を出して助けを求める",
          "お母さんは大切",
        ],
        correctIndex: 2,
        explanation: "困ったときに声を上げることは勇気のいること。でもとっても大切なことだよ！",
        points: 20,
      },
      {
        type: "inference",
        question: "あなたが困ったとき、誰に・どうやって助けを求めますか？",
        options: [
          "信頼できる友達に正直に話す",
          "まず先生や大人に相談する",
          "一度だけ自分で考えてからSOSを出す",
          "勇気を出して「助けて」と言う！",
        ],
        correctIndex: -1,
        explanation: "「助けて」と言える勇気は最強の力！困ったときは一人で抱え込まないでね。",
        points: 20,
      },
    ],
    stickerEmoji: "🐱",
    stickerName: "ねこシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "stamp-3",
    profileId: "stamp",
    title: "くまちゃんのサプライズ",
    subtitle: "友達のために何かすることが、一番の喜び！",
    emoji: "🐻",
    color: "bg-amber-100 border-amber-300",
    pages: [
      {
        text: "モコはやさしいクマの女の子。\n親友のシロクマのユキちゃんが、最近元気がないことに気づきました。\n「どうしたのかな？何か悩んでいるのかな？」",
        emoji: "🐻",
      },
      {
        text: "モコはユキちゃんに聞いてみました。\n「最近、ピアノの練習がうまくいかなくて、悲しいの…」\nモコは真剣に聞いてあげました。「そっか、大変だったね」",
        emoji: "🎹",
      },
      {
        text: "モコは考えました。「そうだ！ユキちゃんを元気づけるために\nサプライズをしよう！」\nモコは友達みんなに声をかけて、秘密のパーティーを計画しました。",
        emoji: "🎉",
      },
      {
        text: "ユキちゃんの誕生日に、みんなが集まりました。\n「サプライズ！！」\nユキちゃんの目が大きく丸くなって、それからぱあっと輝きました。",
        emoji: "🎂",
      },
      {
        text: "「こんなに友達がいてくれるなら、また頑張れる！」\nユキちゃんは泣きながら笑っていました。\nモコも、友達みんなも、胸がいっぱいになりました。",
        emoji: "💝",
      },
    ],
    moral: "友達が悩んでいるとき、黙って見ていることはないよ。声をかけて、一緒に笑ってあげること。それが本当の友達です！",
    quiz: [
      {
        type: "multiple_choice",
        question: "ユキちゃんはなぜ元気がありませんでしたか？",
        options: [
          "お腹が痛かった",
          "ピアノの練習がうまくいかなかった",
          "宿題が多かった",
          "お友達と喧嘩した",
        ],
        correctIndex: 1,
        explanation: "ピアノがうまくいかなくて悲しかったんだね。",
        points: 15,
      },
      {
        type: "true_false",
        question: "モコは一人でサプライズの計画を立てた。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "「友達みんなに声をかけて」計画を立てたよ。一人じゃなくてみんなで協力したんだね！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "本当の友達とはどんな人ですか？",
        options: [
          "同じ学校の人",
          "困っているとき声をかけて一緒に笑える人",
          "プレゼントをくれる人",
          "よく会う人",
        ],
        correctIndex: 1,
        explanation: "困っているときに声をかけて、一緒に笑える人が本当の友達だよ！",
        points: 20,
      },
      {
        type: "inference",
        question: "あなたが友達のためにできる「さりげないやさしさ」はどんなこと？",
        options: [
          "悲しそうにしていたら「どうしたの？」と声をかける",
          "忘れ物をしたとき、そっと貸してあげる",
          "つらそうなとき、隣でただ一緒にいてあげる",
          "頑張っている友達に「すごいね！」と伝える",
        ],
        correctIndex: -1,
        explanation: "どれも本物のやさしさ！小さなことでも、友達の心を温かくできるよ。",
        points: 20,
      },
    ],
    stickerEmoji: "🐻",
    stickerName: "くまシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "stamp-4",
    profileId: "stamp",
    title: "ぱんだちゃんのあきらめない心",
    subtitle: "失敗しても、もう一度立ち上がれば必ず夢に近づく！",
    emoji: "🐼",
    color: "bg-gray-100 border-gray-300",
    pages: [
      {
        text: "パンダのハナコは絵が大好き。\n絵のコンクールに出したくて、一生懸命練習してきました。\nでも…結果は落選。「わたし、才能がないのかな」と泣きました。",
        emoji: "🐼",
      },
      {
        text: "お母さんが言いました。「ハナコ、失敗は終わりじゃないよ。\n失敗は、もっと上手になるためのヒントなの。\nどこが上手くいかなかったか、考えてみようか？」",
        emoji: "🎨",
      },
      {
        text: "ハナコはお母さんと一緒に、自分の絵を見直しました。\n「ここの色使いをもう少し工夫すればよかったかも」\n「うん、それに気づけたなら、次はもっとよくなる！」",
        emoji: "🖌️",
      },
      {
        text: "ハナコはまた練習を始めました。\n最初は怖かったけれど、失敗を恐れないで挑戦し続けました。\n少しずつ、少しずつ、絵が上手になっていきました。",
        emoji: "📚",
      },
      {
        text: "次の年のコンクールで、ハナコの絵は賞をもらいました！\n「あの時あきらめなくて、本当によかった！」\nハナコは涙をこらえながら、賞状をぎゅっと抱きしめました。",
        emoji: "🏆",
      },
    ],
    moral: "失敗は恥ずかしいことじゃない。失敗から学んで、もう一度立ち上がることが大切です。あきらめた瞬間だけが本当の失敗です！",
    quiz: [
      {
        type: "multiple_choice",
        question: "コンクールに落ちた後、お母さんは何と言いましたか？",
        options: [
          "「もうやめなさい」",
          "「才能がないね」",
          "「失敗はもっと上手になるためのヒント」",
          "「先生に怒ってもらおう」",
        ],
        correctIndex: 2,
        explanation: "失敗をヒントに変えられるのがすごい！お母さんの言葉、覚えておこう。",
        points: 15,
      },
      {
        type: "true_false",
        question: "ハナコは最初のコンクールで賞をもらった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "最初は落選したけど、あきらめずに練習して次の年に賞をとったんだよ！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "ハナコが学んだことは何ですか？",
        options: [
          "絵は難しい",
          "失敗してもあきらめなければ夢に近づける",
          "コンクールは大切",
          "お母さんの言うことを聞く",
        ],
        correctIndex: 1,
        explanation: "失敗→学ぶ→再挑戦！これが夢を叶える秘密のサイクルだよ！",
        points: 20,
      },
      {
        type: "inference",
        question: "あなたが何かに失敗したとき、どうやって立ち直りますか？",
        options: [
          "「なぜ失敗したか？」を考えて次に活かす",
          "信頼できる人に話を聞いてもらう",
          "少し休んでから、また挑戦する",
          "「失敗は成長のチャンス！」と自分に言い聞かせる",
        ],
        correctIndex: -1,
        explanation: "どれも立派な立ち直り方！失敗と向き合える人は、必ず強くなれるよ。",
        points: 20,
      },
    ],
    stickerEmoji: "🐼",
    stickerName: "ぱんだシール",
    readCoins: 500,
    readXp: 100,
  },
  {
    id: "stamp-5",
    profileId: "stamp",
    title: "りすちゃんのしょうじきな気持ち",
    subtitle: "正直であることが、一番の勇気！",
    emoji: "🐿️",
    color: "bg-orange-100 border-orange-300",
    pages: [
      {
        text: "リスのコマリは、クラスのみんなに人気者でした。\nある日、図工の時間にみんなが作った工作が展示されました。\n先生が「一番上手な子に、特別なシールをあげます」と言いました。",
        emoji: "🐿️",
      },
      {
        text: "コマリは自分の工作を見ました。うまく作れたと思っていたけれど、\nとなりのリリちゃんの工作のほうがずっと素敵でした。\nコマリは少しうらやましかったです。",
        emoji: "🎨",
      },
      {
        text: "先生が「コマリちゃん、一番上手です！」と言いました。\nコマリはびっくり。でも、本当はリリちゃんのほうが上手だとわかっていました。\n「どうしよう…黙っていたほうが楽だけど…」",
        emoji: "😓",
      },
      {
        text: "コマリは深呼吸して、先生に言いました。\n「先生、リリちゃんの工作のほうが上手だと思います。\nわたしより、リリちゃんにシールをあげてください」",
        emoji: "💬",
      },
      {
        text: "先生もクラスのみんなも驚きました。そして、みんなで拍手！\n「コマリちゃんの正直さがすばらしい！君に特別な正直シールをあげます」\nリリちゃんも「ありがとう、コマリちゃん！」と言ってくれました。",
        emoji: "👏",
      },
    ],
    moral: "正直に言うことは、ときに勇気がいります。でも、本当のことを言える人が、本当に信頼される人です。正直さは最強の勇気！",
    quiz: [
      {
        type: "multiple_choice",
        question: "コマリが「本当はリリちゃんが上手」と思ったのはなぜですか？",
        options: [
          "リリちゃんの工作が素敵だったから",
          "先生に言われたから",
          "コマリが自信を失ったから",
          "友達に聞いたから",
        ],
        correctIndex: 0,
        explanation: "自分の目でリリちゃんの工作が上手だと気づいたんだね。それが正直さの始まり！",
        points: 15,
      },
      {
        type: "true_false",
        question: "コマリは先生の言葉をそのまま受け入れて、何も言わなかった。",
        options: ["○ ほんとう", "× うそ"],
        correctIndex: 1,
        explanation: "コマリは勇気を出して「リリちゃんのほうが上手です」と正直に言ったんだよ！",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "コマリが正直に言った後、どうなりましたか？",
        options: [
          "みんなに笑われた",
          "先生に怒られた",
          "みんなに拍手された",
          "何も起きなかった",
        ],
        correctIndex: 2,
        explanation: "正直さはみんなに認められる！コマリの勇気はみんなに伝わったんだね。",
        points: 20,
      },
      {
        type: "inference",
        question: "正直に言うのが難しいとき、あなたはどうしますか？",
        options: [
          "「長い目で見れば正直が一番」と思って勇気を出す",
          "まず深呼吸して、自分の気持ちを整理してから話す",
          "信頼できる友達か大人に相談してから伝える",
          "「正直に言えば必ず理解してもらえる」と信じて話す",
        ],
        correctIndex: -1,
        explanation: "どれも賢い選択！正直さは人の信頼を勝ち取る最強の武器だよ。",
        points: 20,
      },
    ],
    stickerEmoji: "🐿️",
    stickerName: "りすシール",
    readCoins: 500,
    readXp: 100,
  },
];
