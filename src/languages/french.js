const Language = require("../structures/Language.js");
const constants = require("@utils/constants");

module.exports = new Language("french", "Français", {
  LANGUAGE_SET: "la langue a été réglée sur Français!\n\n**Remarque**: la traduction française est toujours incomplète.",
  GUILD_ONLY: "Stupide! Cette commande ne peut être utilisée dans mes messages privés.",
  OWNER_ONLY: "Stupide! Cette commande est réservée à mon maître!",
  CHANNEL_NOT_FOUND: "Le canal demandé est introuvable.",
  ROLE_NOT_FOUND: "Le rôle indiqué est introuvable.",
  NONE: "Rien",
  // Categories
  CATEGORY_ANIMALS: "Animaux",
  CATEGORY_GENERAL: "Général",
  CATEGORY_FUN: "Amusement",
  CATEGORY_UTILITY: "Utilitaires",
  CATEGORY_SOCIAL: "Social",
  CATEGORY_OWNER: "Propriétaire",
  CATEGORY_MODERATION: "Modération",
  CATEGORY_PROGRAMMING: "Programmation",
  CATEGORY_MISC: "Divers",
  CATEGORY_CONFIG: "Configuration",
  CATEGORY_REACTIONS: "Réactions",
  COMMAND_STATS_DESCRIPTION: "Salut, je suis miyako. Le bot de divertissement tout-en-un pour votre serveur. Mon maître est Ravener#5796",
  COMMAND_STATS_TITLE: "Miyako - Statistiques du bot",
  COMMAND_STATS_FIELD: "Statisques du bot",
  COMMAND_CHOOSE: (choice) => `Je penses que ${choice}`,
  COMMAND_CHOOSE_THINKING: (user) => `${constants.typing} **${user}** pense...`,
  COMMAND_8BALL_ASK: "Stupide! Quel est ta question?",
  COMMAND_PROFILE_LEVEL: "Niveau",
  COMMAND_PROFILE_POINTS: "Points",
  COMMAND_PROFILE_REP: "Points de réputation",
  COMMAND_CAT_TITLE: "Chat aléatoire",
  COMMAND_DOG_TITLE: "Chien aléatoire",
  COMMAND_MYID: (user) => `${user} votre identifiant discord est **${user.id}**`,
  COMMAND_HELP_TITLE: "Aide - Commandes",
  COMMAND_EVAL_TOKEN: "[JETON]",
  COMMAND_AVATAR_TITLE: (user) => `Avatar de ${user}`,
  COMMAND_SERVERICON_TITLE: (guild) => `Icône du serveur ${guild}`,
  // NSFW Commands
  COMMAND_BOOBS: "Hentai Seins"
}, require("./english.js"));
