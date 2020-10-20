const Command = require("../../structures/Command.js");

class Title extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change your profile's title",
      usage: "title <title>"
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! You must provide a title.");
    const title = args.join(" ");
    await msg.author.update({ title });
    return msg.send(`Success! changed your title view it with \`${msg.guild.settings.prefix}profile\``);
  }
}

module.exports = Title;
