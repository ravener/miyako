const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class NPMPkgSize extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shows the install/publish size of a npm package.",
      usage: "npmpkgsize express",
      aliases: ["pkgsize"],
      cooldown: 5
    });
  }
  
  async run(ctx, [name]) {
    if(!name) return ctx.reply("Baka! What package am I supposed to show you?");
    
    const { publishSize, installSize } = await fetch(`https://packagephobia.now.sh/api.json?p=${encodeURIComponent(name)}`)
      .then((res) => res.json());
    
    if(!publishSize && !installSize) return ctx.reply("That package doesn't exist.");

    const embed = new MessageEmbed()
      .setTitle(`NPM Package Size - ${name}`)
      .setColor(0x9590EE)
      .setDescription(`**Publish Size:** ${this.client.utils.getBytes(publishSize)}\n**Install Size:** ${this.client.utils.getBytes(installSize)}`)
      .setFooter("Powered by packagephobia.now.sh")
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 256 }));
    
    return ctx.reply({ embed });
  }
}

module.exports = NPMPkgSize;
