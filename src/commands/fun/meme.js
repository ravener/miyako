const Command = require("../../structures/Command.js");

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
  
  async run(msg) {
    const { data: { children } } = await fetch("https://www.reddit.com/r/dankmemes/top.json?sort=top&t=day&limit=500")
      .then((res) => res.json());
    const meme = this.client.utils.random(children).data;
    
    const embed = this.client.embed()
      .setTitle(meme.title)
      .setImage(meme.url)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setFooter(`👍 ${meme.ups} | 👎 ${meme.downs}`);
    return msg.send({ embed });
  }
}

module.exports = Meme;
