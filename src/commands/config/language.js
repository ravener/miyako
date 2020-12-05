const Command = require("../../structures/Command.js");
const languages = require("../../languages");

class Language extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change language of the bot.",
      aliases: ["lang", "setlanguage", "setlang"],
      userPermissions: ["MANAGE_GUILD"],
      usage: "language <language>",
      guildOnly: true
    });
  }

  async run(msg, [action]) {
    const display = Object.values(languages).map(lang => `\`${lang.name}\` - ${lang.display}`).join("\n");
    if(!action) return msg.send(`${msg.tr("COMMAND_LANGUAGE_SELECT")}\nUsage: \`${msg.guild.prefix}${this.usage}\`\n\n${display}`);

    const lang = languages[action.toLowerCase()];

    if(!lang)
      return msg.send(`Baka! That's not a valid language.\nAvailable languages:\n\n${display}`);

    await msg.guild.update({ language: lang.name });
    return msg.sendLocale("LANGUAGE_SET");
  }
}

module.exports = Language;
