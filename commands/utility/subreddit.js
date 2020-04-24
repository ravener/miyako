const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class SubReddit extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["sub", "reddit"],
      description: "Returns information on a subreddit.",
      usage: "subreddit <name>",
      cooldown: 5
    });

    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(ctx, [subredditName]) {
    const subreddit = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`)
      .then((res) => res.json())
      .then((body) => {
        if(body.kind === "t5") return body.data;
        throw "That subreddit doesn't exist.";
      })
      .catch(() => { throw this.errorMessage; });

    const embed = new MessageEmbed()
      .setTitle(subreddit.title)
      .setDescription(subreddit.public_description)
      .setURL(`https://www.reddit.com/r/${subredditName}/`)
      .setColor(0x9590EE)
      .setThumbnail(subreddit.icon_img)
      .setImage(subreddit.banner_img)
      .addField("Subscribers", subreddit.subscribers.toLocaleString(), true)
      .addField("Users Active", subreddit.accounts_active.toLocaleString(), true);
    return ctx.reply({ embed });
  }
}

module.exports = SubReddit;
