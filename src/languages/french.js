const Language = require("../structures/Language.js");
const constants = require("@utils/constants");

module.exports = new Language("french", "Français", {
  LANGUAGE_SET: "la langue a ajusté au français\n\n**Remarque**: la traduction française est toujours incomplet",
  GUILD_ONLY: "stupide! Cette commande ne peut être utilisée que sur un serveur. Que faites-vous dans mes messages directs?",
  OWNER_ONLY: "Stupide! Que pensez-vous que vous faites? Cette commande est seulement pour mon maître!",
  CHANNEL_NOT_FOUND: "Je n'ai pas pu trouver ce canal",
  ROLE_NOT_FOUND: "Ce rôle n'existe pas",
  NONE: "Rien",
  // Categories
  CATEGORY_ANIMALS: "Les animaux",
  CATEGORY_GENERAL: "Général",
  CATEGORY_FUN: "Amusement",
  CATEGORY_UTILITY: "Utilitaires",
  CATEGORY_SOCIAL: "Sociaux",
  CATEGORY_OWNER: "Le propriétaire",
  CATEGORY_MODERATION: "Modération",
  CATEGORY_PROGRAMMING: "Programmation",
  CATEGORY_MISC: "Divers",
  CATEGORY_CONFIG: "Réglages",
  CATEGORY_REACTIONS: "Réactions",
  COMMAND_STATS_DESCRIPTION: "Salut, je suis miyako. Le bot de divertissement tout-en-un pour votre serveur vous a apporté par mon maître Ravener#5796",
  COMMAND_STATS_TITLE: "Miyako - Statistiques de bot",
  COMMAND_STATS_FIELD: "Statisques de bot",
  COMMAND_CHOOSE: (choice) => `Je pense que ${choice}`,
  COMMAND_CHOOSE_THINKING: (user) => `${constants.typing} **${user}** pense...`,
  COMMAND_8BALL_ASK: "stupide! Que veux-tu demander?",
  COMMAND_PROFILE_LEVEL: "Niveau",
  COMMAND_PROFILE_POINTS: "Points",
  COMMAND_PROFILE_REP: "Points de réputation",
  COMMAND_CAT_TITLE: "chat aléatoire",
  COMMAND_DOG_TITLE: "chien au hasard",
  COMMAND_MYID: (user) => `${user} Votre identifiant d'utilisateur est **${user.id}**`,
  COMMAND_HELP_TITLE: "aide - commandes",
  COMMAND_EVAL_TOKEN: "[JETON]",
  COMMAND_AVATAR_TITLE: (user) => `Avatar de ${user}`,
  COMMAND_SERVERICON_TITLE: (guild) => `Icône de ${guild}`,
  // NSFW Commands
  COMMAND_BOOBS: "Hentai seins"
}, require("./english.js"));
