const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class AAvatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get an Anime Avatar.",
      extendedHelp: "The output will be NSFW only if the channel is a NSFW channel",
      cooldown: 3,
      cost: 5
    });
  }

  async run(ctx) {
    const { url } = await fetch(`https://nekos.life/api/v2/img/${ctx.channel.nsfw ? "nsfw_" : ""}avatar`)
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle(`${ctx.channel.nsfw ? "NSFW " : ""}Anime Avatar`)
      .setColor(0x9590EE)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = AAvatar;
