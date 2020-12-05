const Language = require("../structures/Language.js");
const constants = require("@utils/constants");

module.exports = new Language("japanese", "日本語", {
  LANGUAGE_SET: "言語は日本語に設定されました\n\n**ノート**: 日本語の翻訳はまだ未完です",
  GUILD_ONLY: "馬鹿! このコマンドはサーバーでのみ使用できます。私のダイレクトメッセージでは何をしてるの?",
  OWNER_ONLY: "馬鹿! 何をしてんだよ? そのコマンドは私のマスターのためだけです",
  CHANNEL_NOT_FOUND: "そのチャンネルが見つかりません",
  ROLE_NOT_FOUND: "そのロールが存在しません",
  MENTION_REMINDER: (prefix) => `こんにちは! コマンドのリストために\`${prefix}help\`を使用してください`,
  DID_YOU_MEAN: (cmd) => `|\`❔\`| あなたは\`${cmd}\`を意味しましたか？`,
  NONE: "無し",
  SECONDS: "秒",
  // Categories
  CATEGORY_GENERAL: "ジェネラル",
  CATEGORY_ANIME: "アニメ",
  CATEGORY_NSFW: "エロ",
  CATEGORY_OWNER: "オーナー",
  CATEGORY_FUN: "ファン",
  CATEGORY_UTILITY: "ユーティリティ",
  CATEGORY_ANIMALS: "動物",
  CATEGORY_CONFIG: "設定",
  CATEGORY_IMAGES: "画像",
  CATEGORY_MODERATION: "適度",
  CATEGORY_REACTIONS: "リアクション",
  CATEGORY_SOCIAL: "ソーシャル",
  CATEGORY_PROGRAMMING: "プログラミング",
  CATEGORY_MISC: "その他",
  WELCOME_MESSAGES: [
    "お! おはようございます **{{user}}-さん**",
    "**{{user}}-さん**, **{{guild}}**へようこそ!"
  ],
  GOODBYE_MESSAGES: [
    "**{{user}}-さん**... いいえ...",
    "**{{user}}-さん**は出るのボタンを発見しました"
  ],
  LEVEL_MESSAGES: [
    "あなたはただレベル**{{level}}**、悪くない...",
    "**{{user}}** あなたのレベル? それは**{{level}}**, 馬鹿!",
    "**{{user}}** またこれ? とにかく、あなたはレベル**{{level}}**です"
  ],
  DAILY_SUCCESS_MESSAGES: [
    "やった! あなたは**{{amount}}**を得ました",
    "あなたのお父さんは**{{amount}}**をあげた? 私は毎時はもっと得ます!",
    "な-なに?! あなたは**{{amount}}**を得ました、うわー！"
  ],
  PING_MESSAGES: [
    "ば-ばか! 私のピングは**{{ms}}ミリ秒**だよ! 今幸せなの?",
    "これ大丈夫? 私は**{{ms}}ミリ秒**で回答しました",
    "**{{user}}**はい私はここだよ、**{{ms}}ミリ秒**で回答しました",
    "私はそれを正しくしましたか？**{{ms}}ミリ秒**で回答しました",
    "あなたは私にそのメッセージを読むのにどのくらいかかりましたかわかりますか？ あなたは私の時間の**{{ms}}ミリ秒**を無駄にしました",
    "**{{user}}**, ね, このメッセージを送信するのに**{{ms}}ミリ秒**かかりました"
  ],
  RELOAD_ERR_UNLOAD: [
    "**{{user}}-さん**、私はそれを壊したと思います... これが起こりました: **{{response}}**"
  ],
  RELOAD_NOT_FOUND: [
    "何をしてるの? **{{command}}**は存在しません! 馬鹿!"
  ],
  RELOAD_MISSING_ARG: [
    "な-なに?! 何をしていいのか分かりません、あなたは私に何も与えませんでした!"
  ],
  LEVELUP_MESSAGES: [
    "な-なに？ あなたはレベル**{{level}}**早く到達しました...",
    "やった！ あなたはレベルアップされました、**{{user}}-さん**！ あなたは今レベル**{{level}}**、それは何も意味するのではありません！",
    "あなたはただレベル**{{level}}**? 最低!",
    "**{{user}}-さん**、あなたがレベル**{{level}}**のために今私を忘れないでください",
    "どのようにあなたはレベル**{{level}}**あなた馬鹿！"
  ],
  COMMAND_STATS_DESCRIPTION: "こんにちは、私はミヤコです。 あなたのサーバーのためのオールインワンエンターテイメントボットが私のマスターRavener#5796によってあなたにもたらされました",
  COMMAND_STATS_TITLE: "ミヤコ - ボット統計",
  COMMAND_STATS_FIELD: "ボット統計",
  COMMAND_CHOOSE: (choice) => `${choice}と思います`,
  COMMAND_CHOOSE_THINKING: (user) => `${constants.typing} **${user}**は考えています...`,
  COMMAND_8BALL_ASK: "馬鹿! 何を尋ねたいですか？",
  COMMAND_PROFILE_LEVEL: "レベル",
  COMMAND_PROFILE_POINTS: "ポイント",
  COMMAND_PROFILE_REP: "評判ポイント",
  COMMAND_PROFILE_TITLE: (name) => `${name}のプロフィール`,
  COMMAND_CAT_TITLE: "ランダムな猫",
  COMMAND_DOG_TITLE: "ランダムな犬",
  COMMAND_FOX_TITLE: "ランダムな狐",
  COMMAND_MYID: (user) => `${user} あなたのユーザーIDは **${user.id}**`,
  COMMAND_KICK_BOT: "馬鹿! 何で私をキックしますか?",
  COMMAND_KICK_SELF: "馬鹿! 何で自分をキックしますか?",
  COMMAND_KICK_OWNER: "馬鹿! オーナーをキックできません",
  COMMAND_KICK_USER_CANNOT: "あなたはこのユーザをキックできません",
  COMMAND_KICK_BOT_CANNOT: "私はこのユーザをキックできません",
  COMMAND_HELP_TITLE: "ヘルプ - コマンド",
  COMMAND_LANGUAGE_SELECT: "言語を選択してください",
  COMMAND_SAY: "私はあなたの何でもほしいを言います",
  COMMAND_SAY_WHAT: "馬鹿! あなたは私に何を言ってほしいですか？",
  COMMAND_HELP_FOR: (cmd) => `コマンド${cmd}のためのヘルプ`,
  COMMAND_EVAL_ERROR: (err) => `このエラーは起こりました: \`\`\`js\n${err.stack || err}\`\`\``,
  COMMAND_EVAL_TOKEN: "[トークン]",
  COMMAND_ANNOUNCEMENTS_TITLE: "ボットの告知!",
  COMMAND_ANNOUNCEMENTS_FOOTER: (prefix) => `ミヤコのラウンジから (${prefix}supportを使って私たちに参加してください)`,
  COMMAND_SUPPORT_DESCRIPTION: "サポートサーバーに参加する",
  COMMAND_SUPPORT_TITLE: "ミヤコのラウンジを参加する",
  COMMAND_POKEMON_GUESS: "推測するには15秒があります。そのポケモンは誰ですか？英語の名前を入力してください",
  COMMAND_SLOTS_TITLE: "ミヤコのスロット",
  COMMAND_SLOTS_WIN: (points) => `おめでとうございます! あなたは**¥${points}**を勝った！`,
  COMMAND_OWO: "OwO! 何これ?",
  COMMAND_HELP_DESCRIPTION: "説明",
  COMMAND_HELP_CATEGORY: "カテゴリー",
  COMMAND_AVATAR_TITLE: (user) => `${user}のアバター`,
  COMMAND_LYRICS_WHAT: "馬鹿! 何歌を見つけたいの?",
  COMMAND_SERVERICON_TITLE: (guild) => `${guild}のアイコン`,
  // NSFW Commands
  COMMAND_HENTAI: "エロアニメ",
  COMMAND_BOOBS: "エロアニメのおっぱい",
  COMMAND_PUSSY: "エロアニメのおまんこ"
}, require("./english.js"));

