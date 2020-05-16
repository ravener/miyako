const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Shibe extends Command {
  constructor(...args) {
    super(...args, {
      description: "Post a randomly selected image of a Shiba Inu.",
      extended: "This command will return a beautiful Shiba Inu.",
      cost: 5,
      cooldown: 3,
      aliases: ["doge", "shib", "shibe", "shibainu"],
      botPermissions: ["EMBED_LINKS"]
    });
  }

  async run(ctx) {
    const [url] = await fetch("https://shibe.online/api/shibes")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Shiba Inu")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(url);

    return ctx.reply({ embed });
  }
}

module.exports = Shibe;
