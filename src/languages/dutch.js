const Language = require("../structures/Language.js");

module.exports = new Language("dutch", "Nederlands", {
  LANGUAGE_SET: "Taal is ingesteld op het Nederlands\n\n**Opmerking**: Nederlandse vertaling is nog steeds onvolledig",
  OWNER_ONLY: "Stom! Wat denk je dat je aan het doen bent? Die commando is alleen voor mijn meester!",
  GUILD_ONLY: "Stom! U kunt deze commando alleen in een server gebruiken. Wat doe je in mijn directe berichten?",
  DID_YOU_MEAN: (cmd) => `|\`❔\`| Bedoelde u \`${cmd}\`?`,
  MENTION_REMINDER: (prefix) => `Hoi! Gebruik \`${prefix}help\` voor een lijst met commando's die u kunt gebruiken`,
  NONE: "Niets",
  SECONDS: "Seconden",
  ROLE_NOT_FOUND: "Die rol bestaat niet",
  CHANNEL_NOT_FOUND: "Ik kon dat kanaal niet vinden",
  // Categories
  CATEGORY_ANIMALS: "Dieren",
  CATEGORY_CONFIG: "Instellingen",
  CATEGORY_GENERAL: "Algemeen",
  CATEGORY_IMAGES: "Beelden",
  CATEGORY_MISC: "Diversen",
  CATEGORY_UTILITY: "Utiliteit",
  CATEGORY_PROGRAMMING: "Programmering",
  CATEGORY_SOCIAL: "Sociale",
  CATEGORY_MODERATION: "Matiging",
  CATEGORY_REACTIONS: "Reacties",
  CATEGORY_OWNER: "Eigenaar",

  COMMAND_HELP_TITLE: "Hulp - Commando's",
  COMMAND_HELP_FOR: (cmd) => `Hulp voor commando ${cmd}`,
  COMMAND_OWO: "OwO! Wat is dit?",
  COMMAND_PROFILE_LEVEL: "Niveau",
  COMMAND_PROFILE_POINTS: "Punten",
  COMMAND_PROFILE_REP: "Reputatiepunten",
  COMMAND_PROFILE_TITLE: (user) => `Profiel van ${user}`,
  COMMAND_MYID: (user) => `${user} Uw gebruikers-ID is: **${user.id}**`,
  COMMAND_STATS_DESCRIPTION: "Hallo, ik ben Miyako. alles in één entertainment bot voor uw server gebracht aan u door mijn meester Ravener#5796",
  COMMAND_ANNOUNCEMENTS_TITLE: "Bot-aankondigingen!",
  COMMAND_ANNOUNCEMENTS_FOOTER: (prefix) => `Van Miyako Lounge (gebruik ${prefix}support om bij ons te voegen)`,
  COMMAND_SAY: "Ik zal zeggen wat je wilt",
  COMMAND_SAY_WHAT: "Stom! Wat wil je dat ik zeg?",
  COMMAND_HELP_DESCRIPTION: "Beschrijving",
  COMMAND_HELP_CATEGORY: "Categorie",

  // NSFW Commands
  COMMAND_BOOBS: "Hentai borsten"
}, require("./english.js"));
