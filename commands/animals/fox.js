const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Fox extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomfox"],
      description: "Grabs a random fox image from randomfox.ca",
      extendedHelp: "This command grabs a random fox from https://randomfox.ca/floof/",
      cooldown: 3
    });
  }

  async run(ctx) {
    const { image } = await fetch("https://randomfox.ca/floof/")
      .then((res) => res.json());

    return ctx.reply(new MessageEmbed()
      .setTitle("Random Fox")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(image));
  }
}

module.exports = Fox;
