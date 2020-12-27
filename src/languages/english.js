const Language = require("../structures/Language.js");
const responses = require("@utils/responses");
const constants = require("../utils/constants.js");

// English translation.
// This can be used as a template to start translating into a different language.
// So I've included comments to help you out with using this as a base.
// When copying the file to start a new translation please remove the unnecessary comments such as this

// Argument 1: Language name. This is the English name for the language that will be used to switch the language.
// Argument 2: Native name. This is the name of the language in the language itself, used for extra display.
// Argument 3: Keys. All the translations go here.
// Argument 4: Default language. Language to lookup keys from if one wasn't found in the current one. (see bottom of file)
module.exports = new Language("english", "English", {
  // Translation keys are mostly incomplete as some English replies are still hardcoded
  // When translating this key to a different language please append two newlines (\n\n) and a translation of
  // **Note**: The (insert language name) translation is still incomplete
  LANGUAGE_SET: "Language has been set to English",
  GUILD_ONLY: "Baka! You can only use this command in a server. What are you doing in my DMs?",
  OWNER_ONLY: "Baka! What do you think you're doing? That command is only for my master!",
  CHANNEL_NOT_FOUND: "I could not find that channel.",
  ROLE_NOT_FOUND: "That role does not exist.",
  MENTION_REMINDER: (prefix) => `Hi! Run \`${prefix}help\` for a list of commands you can use.`,
  DID_YOU_MEAN: (cmd) => `|\`❔\`| Did you mean \`${cmd}\`?`,
  NONE: "None",
  SECONDS: "Seconds",
  BLACKLISTED: "You've been blacklisted from using the bot for abusive reasons. Please join https://discord.gg/mDkMbEh or contact Ravener#5796 for a chance to appeal.",
  BLACKLISTED_GUILD: (guild) => `The server **${guild.name}** has been blacklisted from using the bot. If you are an Admin of the server please join https://discord.gg/mDkMbEh or contact Ravener#5796 for a chance to appeal.`,

  // These are random funny responses we use for some replies
  // Located in utils/responses.js
  // They can be translated too so look there.
  // I was lazy to move them here but that's a TODO
  WELCOME_MESSAGES: responses.welcomeMessages,
  GOODBYE_MESSAGES: responses.goodbyeMessages,
  LEVEL_MESSAGES: responses.levelMessages,
  DAILY_SUCCESS_MESSAGES: responses.dailySuccessMessages,
  PING_MESSAGES: responses.pingMessages,
  RELOAD_ERR_UNLOAD: responses.reloadErrUnload,
  RELOAD_NOT_FOUND: responses.reloadNotFound,
  RELOAD_MISSING_ARG: responses.reloadMissingArg,
  LEVELUP_MESSAGES: responses.levelUpMessages,

  // Categories.
  CATEGORY_GENERAL: "General",
  CATEGORY_CONFIG: "Config",
  CATEGORY_ANIME: "Anime",
  CATEGORY_NSFW: "NSFW",
  CATEGORY_OWNER: "Owner",
  CATEGORY_FUN: "Fun",
  CATEGORY_UTILITY: "Utility",
  CATEGORY_IMAGES: "Images",
  CATEGORY_ANIMALS: "Animals",
  CATEGORY_MODERATION: "Moderation",
  CATEGORY_SOCIAL: "Social",
  CATEGORY_PROGRAMMING: "Programming",
  CATEGORY_MISC: "Miscellaneous",
  CATEGORY_REACTIONS: "Reactions",

  COMMAND_STATS_DESCRIPTION: "Hi, I'm Miyako. The all-in-one entertainment bot for your server brought to you by my master Ravener#5796",
  COMMAND_STATS_TITLE: "Miyako - Bot Statistics",
  COMMAND_STATS_FIELD: "Bot Stats",
  COMMAND_CHOOSE: (choice) => `I think ${choice}`,
  COMMAND_CHOOSE_THINKING: (user) => `${constants.typing} **${user}** is thinking...`,
  COMMAND_8BALL_ASK: "Baka! What do you want to ask?",
  COMMAND_PROFILE_LEVEL: "Level",
  COMMAND_PROFILE_POINTS: "Points",
  COMMAND_PROFILE_REP: "Reputation Points",
  COMMAND_PROFILE_TITLE: (name) => `${name}'s profile`,
  COMMAND_CAT_TITLE: "Random Cat",
  COMMAND_DOG_TITLE: "Random Dog",
  COMMAND_FOX_TITLE: "Random Fox",
  COMMAND_MYID: (user) => `${user} Your User ID is: **${user.id}**`,
  COMMAND_KICK_BOT: "Baka! Why would you kick me?",
  COMMAND_KICK_SELF: "Baka! Why would you kick yourself?",
  COMMAND_KICK_OWNER: "Baka! You can't kick the owner.",
  COMMAND_KICK_USER_CANNOT: "You cannot kick this user.",
  COMMAND_KICK_BOT_CANNOT: "I cannot kick this user.",
  COMMAND_HELP_TITLE: "Help - Commands",
  COMMAND_LANGUAGE_SELECT: "Please select a language.",
  COMMAND_SAY: "I will say whatever you want me to.",
  COMMAND_SAY_WHAT: "Baka! What do you want me to say?",
  COMMAND_HELP_FOR: (cmd) => `Help for command ${cmd}`,
  COMMAND_EVAL_ERROR: (err) => `The following error occured: \`\`\`js\n${err.stack || err}\`\`\``,
  COMMAND_EVAL_TOKEN: "[TOKEN]",
  COMMAND_ANNOUNCEMENTS_TITLE: "Bot Announcements!",
  COMMAND_ANNOUNCEMENTS_FOOTER: (prefix) => `From Miyako Lounge (Use ${prefix}support to join us)`,
  COMMAND_SUPPORT_DESCRIPTION: "Get the link to our support server.",
  COMMAND_SUPPORT_TITLE: "Join Miyako Lounge",
  COMMAND_POKEMON_GUESS: "You have 15 seconds to guess! Who's that Pokèmon?",
  COMMAND_SLOTS_TITLE: "Miyako Slots",
  COMMAND_SLOTS_WIN: (points) => `Congratulations! You won **¥${points}**`,
  COMMAND_OWO: "OwO! What is this?",
  COMMAND_HELP_DESCRIPTION: "Description",
  COMMAND_HELP_CATEGORY: "Category",
  COMMAND_AVATAR_TITLE: (user) => `${user}'s avatar`,
  COMMAND_LYRICS_WHAT: "Baka! What song are you looking for?",
  COMMAND_SERVERICON_TITLE: (guild) => `${guild}'s icon`,
  COMMAND_BLACKLIST_USER_BLACKLIST: (user) => `Blacklisted user **${user.tag}** (${user.id})`,
  COMMAND_BLACKLIST_USER_UNBLACKLIST: (user) => `Unblacklisted user **${user.tag}** (${user.id})`,
  COMMAND_BLACKLIST_GUILD_BLACKLIST: (guild) => `Blacklisted the guild **${guild.name}** (${guild.id})`,
  COMMAND_BLACKLIST_GUILD_UNBLACKLIST: (guild) => `Unblacklisted the guild **${guild.name}** (${guild.id})`,
  // NSFW Commands
  COMMAND_HENTAI: "Hentai",
  COMMAND_BOOBS: "Hentai Boobs",
  COMMAND_PUSSY: "Hentai Pussy"

  // Uncomment this line below when translating a different language.
  // it just makes English the default language to lookup keys that weren't found.
  // But since we are already in English we comment this out.
  // Just a note for those using the English file as template to start translating.
}/*, require("./english.js")*/);

