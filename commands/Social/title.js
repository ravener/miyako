const { Command } = require("klasa");

class Title extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change your profile's title",
      usage: "<title:string{1,2000}>"
    });
  }

  async run(msg, [title]) {
    await msg.author.settings.update("title", title);
    return msg.send(`Success, changed your title view it with \`${msg.guild.settings.prefix}profile\``);
  }
}

module.exports = Title;
