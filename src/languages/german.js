const Language = require("../structures/Language.js");
const constants = require("../utils/constants.js");


// Thanks to Tinte#0015

module.exports = new Language("german", "Deutsch", {
  LANGUAGE_SET: "Die Sprache wurde auf Deutsch gestellt.\n\n**Hinweis**: Die deutsche Übersetzung ist noch nicht vollständig",
  GUILD_ONLY: "Baka! Du kannst diesen Befehl nur auf einem Server benutzen. Was machst du in meinen DMs?",
  OWNER_ONLY: "Baka! Was tust du? Der Befehl ist nur für meinen Meister!",
  CHANNEL_NOT_FOUND: "Ich konnte den Channel nicht finden.",
  ROLE_NOT_FOUND: "Diese Rolle existiert nicht.",
  MENTION_REMINDER: (prefix) => `Hi! Mit \`${prefix}help\` erhältst du eine Liste aller Befehle.`,
  DID_YOU_MEAN: (cmd) => `|\`❔\`| Meintest du \`${cmd}\`?`,
  NONE: "Undefiniert",
  SECONDS: "Sekunden",

  // Categories
  CATEGORY_GENERAL: "Allgemeines",
  CATEGORY_ANIME: "Anime",
  CATEGORY_NSFW: "NSFW",
  CATEGORY_OWNER: "Eigentümer",
  CATEGORY_FUN: "Spaß",
  CATEGORY_UTILITY: "Nützliches",
  CATEGORY_ANIMALS: "Tiere",
  CATEGORY_CONFIG: "Konfiguration",
  CATEGORY_IMAGES: "Bilder",
  CATEGORY_MODERATION: "Moderation",
  CATEGORY_REACTIONS: "Reaktionen",
  CATEGORY_SOCIAL: "Soziales",
  CATEGORY_PROGRAMMING: "Programmierung",
  CATEGORY_MISC: "Sonstiges",

  WELCOME_MESSAGES: [
    "O-ohayou gozaimasu **{{user}}-san**.",
    "Hmph, scheint so als wäre **{{user}}**, ein weiterer Baka, beigetreten.",
    "Es ist nicht so, dass ich dich mag oder so.. aber willkommen auf dem Server, **{{user}}**",
    "O-oh, willkommen **{{user}}-san**. Ich hoffe, ich bringe dich nicht in Verlegenheit.",
    "OwO, wer ist das? **{{user}}** ist dem Server beigetreten.",
    "**{{user}}**, scheint so als wärest du auf der falschen Seite von Discord gelandet!",
    "Hi, **{{user}}**! Willkommen auf **{{guild}}**, ich hoffe du genießt deinen Aufenthalt!",
    "ERGH, warum ist **{{user}}** beigetreten, ich kümmer mich doch schon um **{{amount}}** Nutzer!",
    "Y-yay! Mehr Leute zum beschäftigen! Willkommen, **{{user}}**",
    "Hi! **{{user}}** ist der Akademie beigetreten!",
    "**{{user}}-san**, willkommen auf **{{guild}}**!"
  ],
  GOODBYE_MESSAGES: [
    "Awh, i-ich finde keine Wörter d-dafür, a-aber ich vermisse dich **{{user}}-san**!",
    "Awh, **{{user}}** hat den Server verlassen.. n-nicht das es mich interessieren würde! Baka!",
    "**{{user}}-san**.... N-nein...",
    "**{{user}}** ist gegangen, nicht das wir ihn brauchten oder so.",
    "**{{user}}** warum lässt du mich hier alleine?",
    "**{{user}}** hat den Verlassen Button entdeckt.",
    "Eep! **{{user}}** hat verlassen?! S-Sie lassen mich immer alleine, die Bakas...",
    "Finally, er ist weg. Ich dachte immer **{{user}}** würde niemals gehen!",
    "Woah! **{{user}}** hat **{{guild}}** verlassen! B-baka, warum ist er überhaupt beigetreten?",
    "Woo, **{{user}}** ist gegangen, jetzt muss ich mich nur noch um **{{amount}}** Mitglieder kümmern!"
  ],
  LEVEL_MESSAGES: [
    "Du bist Level **{{level}}**, nicht schlecht...",
    "Pfft, Level **{{level}}**?",
    "**{{user}}** dein Level? **{{level}}**, baka",
    "**{{user}}**, schon wieder? Was auch immer, du bist Level **{{level}}**.",
    "**{{user}}-san** du bist Level **{{level}}**, bitte schön.",
    "Du bist Level **{{level}}**, eventuell wäre es höher, wärest du aktiver.",
    "Nur Level **{{level}}**? Sogar ich bin besser als das.",
    "Level **{{level}}**? Was, hast du gehofft höher als **{{level}}** zu sein?",
    "nur Level **{{level}}**? Pfft! Ich habe schon viel besseres gesehen."
  ],
  DAILY_SUCCESS_MESSAGES: [
    "Yatta! Du hast **{{amount}}** bekommen.",
    "Gut gemacht, du hast deine täglichen **{{amount}}** geholt.",
    "Endlich, ich dachte du holst dir deine **{{amount}}** heute gar nicht mehr!",
    "Dein Vater hat dir **{{amount}}** gegeben? Ich kriege pro Stunde mehr als das!",
    "Du hast deine täglichen **{{amount}}** geholt, ist das nicht dandy?",
    "N-nani?! Du hast **{{amount}}** bekommen, woah...",
    "Du hast gerade **{{amount}}** bekommen? Vielleicht bezahlst du mir mal ein Abendessen **{{user}}-san**? :wink:",
    "Oh gut, du hast endlich deine **{{amount}}** bekommen. Es ist an der Zeit, jetzt etwas Pocky zu bekommen.",
  ],
  PING_MESSAGES: [
    "Ugh, schon wieder? Du fragst immer, und ich sage dir das ich in **{{ms}}ms** geantwortet habe.",
    "B-baka, ich habe geantwortet... in nur **{{ms}}ms**.",
    "B-bitte schön, ich habe in **{{ms}}ms** geantwortet.",
    "Bitte schön, nicht das es meine Zeit wert gewesen wäre. Es hat mich nur **{{ms}}ms** gekostet.",
    "Ist das richtig? Ich habe nach **{{ms}}ms** geantwortet.",
    "**{{user}}**? Ich habe nach **{{ms}}ms** geantwortet.",
    "**{{user}}**! Du hast **{{ms}}ms** meiner Zeit verschwendet, ERGH!",
    "H-hab ich das richtig gemacht? Ich habe nach **{{ms}}ms** geantwortet.",
    "**{{user}}**, ja ich bin hier, und es hat mich **{{ms}}ms** gekostet um zu antworten.",
    "**{{user}}**! Warum pingst du mich, man! Du hast **{{ms}}ms** meiner Zeit verschwendet!!",
    "**{{user}}** hey, ich habe **{{ms}}ms** gebraucht um diese Nachricht zu senden!",
    "Du hast mich **{{ms}}ms** älter gemacht - nur mit einer Frage.",
    "**{{user}}** ich hab deine Nachricht gelesen, und **{{ms}}ms** gebraucht um mich nicht dafür zu interessieren.",
    "Weißt du wie lang ich gebraucht habe, die Nachricht zu lesen? Du hast **{{ms}}ms** meines Tages ziemlich verschwendet.",
    "B-baka! Mein Ping ist **{{ms}}ms**! Bist du nun glücklich?"
  ],
  RELOAD_ERR_UNLOAD: [
    "**{{user}}-san**, ich glaube ich habe es kaputt gemacht... Das ist passiert: **{{response}}**",
    "Da ist ein Fehler, wahrscheinlich deiner! Baka! **{{response}}**"


  ],
  RELOAD_NOT_FOUND: [
    "Eeeh?! **{{user}}-san**, warum soll ich einen Command finden der nicht existiert? Es war nicht einmal ein Alias.",
    "Was machst du? **{{command}}** existiert nicht! Baka!"

  ],
  RELOAD_MISSING_ARG: [
    "N-nani?! Ich weiß nicht was ich machen soll, du hast mir nichts gegeben!",
    "Baka! Du musst mir einen Befehl zum neulafen geben!"

  ],
  LEVELUP_MESSAGES: [
    "Du bist gerade Level **{{level}}** geworden, Bauer!",
    "YATTA! Du bist ein Level höher gekommen, **{{user}}-san**! Du bist jetzt Level **{{level}}**, nicht dass das was heißen würde!",
    "E-eh? Du bist ein Level höhergekommen? Gut, du bist Level **{{level}}** jetzt, was nicht heißt das ich dich nun mehr mag, **{{user}}**... baka.",
    "Hmph, du bist auf Level **{{level}}** aufgestiegen, **{{user}}-san**. Gut, dass macht keinen Unterschied für mich!",
    "Hyaa~! Du bist ein Level aufgestiegen, **{{user}}-san**, du bist nun Level **{{level}}**.",
    "**{{user}}**, du baka. Lass mich nicht zurück, du bist jetzt Level **{{level}}**.",
    "**{{user}}-san**, vergiss mich nicht, nur weil du jetzt Level **{{level}}** bist!",
    "Pfft, du bist gerade Level **{{level}}** geworden, beeil dich **{{user}}**.",
    "Verrückt, **{{user}}** wird schlau, nun mit einem IQ von **{{level}}**",
    "N-nani? Du hast Level **{{level}}** so schnell erreicht...",
    "Du bist nur Level **{{level}}**? Du widerst mich an!",
    "Wie kannst du Level **{{level}}** sein? D-du baka!",
    "B-baka! Du bist jetzt Level **{{level}}**, jetzt sei frei! D-dummy...",
    "Du bist definitiv Level **{{level}}** du baka!",

  ],
  COMMAND_STATS_DESCRIPTION: "Hi, ich bin Miyako. Der All-in-One Unterhaltungsbot für deinen Server von meinem Meister Ravener#5796",
  COMMAND_STATS_TITLE: "Miyako - Botstatistiken",
  COMMAND_STATS_FIELD: "Botstatistiken",
  COMMAND_CHOOSE: (choice) => `Ich denke ${choice}`,
  COMMAND_CHOOSE_THINKING: (user) => `${constants.typing} **${user}** denkt nach...`,
  COMMAND_8BALL_ASK: "Baka! Was möchtest du fragen?",
  COMMAND_PROFILE_LEVEL: "Level",
  COMMAND_PROFILE_POINTS: "Punkte",
  COMMAND_PROFILE_REP: "Rufpunkte",
  COMMAND_PROFILE_TITLE: (name) => `${name}'s Profil`,
  COMMAND_CAT_TITLE: "Zufällige Katze",
  COMMAND_DOG_TITLE: "Zufälliger Hund",
  COMMAND_FOX_TITLE: "Zufälliger Fuchs",
  COMMAND_MYID: (user) => `${user} deine User ID ist: **${user.id}**`,
  COMMAND_KICK_BOT: "Baka! Warum möchtest du mich kicken?",
  COMMAND_KICK_SELF: "Baka! Warum möchtest du dich kicken?",
  COMMAND_KICK_OWNER: "Baka! Du kannst den Eigentümer nicht kicken.",
  COMMAND_KICK_USER_CANNOT: "Du kannst diesen Nutzer nicht kicken.",
  COMMAND_KICK_BOT_CANNOT: "Ich kann diesen Nutzer nicht kicken.",
  COMMAND_HELP_TITLE: "Hilfe - Befehle",
  COMMAND_LANGUAGE_SELECT: "Bitte wähle eine Sprache aus.",
  COMMAND_SAY: "Ich sage was immer du willst.",
  COMMAND_SAY_WHAT: "Baka! Was soll ich sagen?",
  COMMAND_HELP_FOR: (cmd) => `Hilfe für den ${cmd} Befehl`,
  COMMAND_EVAL_ERROR: (err) => `Der folgende Fehler trat auf: \`\`\`js\n${err.stack || err}\`\`\``,
  COMMAND_EVAL_TOKEN: "[TOKEN]",
  COMMAND_ANNOUNCEMENTS_TITLE: "Bot Ankündigungen!",
  COMMAND_ANNOUNCEMENTS_FOOTER: (prefix) => `Von der Miyako Lounge (Benutz ${prefix}support um uns beizutreten)`,
  COMMAND_SUPPORT_DESCRIPTION: "Hol dir den Link zu unserem Support-Server",
  COMMAND_SUPPORT_TITLE: "Tritt der Miyako Lounge bei.",
  COMMAND_POKEMON_GUESS: "Du hast 15 Sekunden zum erraten! Welches Pokèmon ist das?",
  COMMAND_SLOTS_TITLE: "Miyako Slots",
  COMMAND_SLOTS_WIN: (points) => `Glückwunsch! Du hast **¥${points}** gewonnen!`,
  COMMAND_OWO: "OwO! Was ist das?",
  COMMAND_HELP_DESCRIPTION: "Beschreibung",
  COMMAND_HELP_CATEGORY: "Kategorie",
  COMMAND_AVATAR_TITLE: (user) => `${user}'s Profilbild`,
  COMMAND_LYRICS_WHAT: "Baka! Nach welchem Song suchst du?",
  COMMAND_SERVERICON_TITLE: (guild) => `${guild}'s Servericon`,
  // NSFW Commands
  COMMAND_HENTAI: "Hentai",
  COMMAND_BOOBS: "Hentai Boobs",
  COMMAND_PUSSY: "Hentai Pussy"
}, require("./english.js"));
