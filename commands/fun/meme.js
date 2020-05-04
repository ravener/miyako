const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Meme extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random meme from r/dankmemes",
      cooldown: 5,
      aliases: ["memes", "dankmemes"]
    });
    this.cost = 5;
  }
  
  async run(ctx) {
    const { data: { children } } = await fetch("https://www.reddit.com/r/dankmemes/top.json?sort=top&t=day&limit=500")
      .then((res) => res.json());
    const meme = this.client.utils.random(children).data;
    
    const embed = new MessageEmbed()
      .setTitle(meme.title)
      .setImage(meme.url)
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setFooter(`👍 ${meme.ups} | 👎 ${meme.downs}`);
    return ctx.reply({ embed });
  }
}

module.exports = Meme;
