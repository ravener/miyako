const { Command } = require("klasa");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class SubReddit extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["sub"],
      description: "Returns information on a subreddit.",
      usage: "<subredditName:str>"
    });
    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(msg, [subredditName]) {
    const subreddit = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`)
      .then(response => response.json())
      .then(body => {
        if (body.kind === "t5") return subreddit.data;
        throw "That subreddit doesn't exist.";
      })
      .catch(() => { throw this.errorMessage; });

    const embed = new MessageEmbed()
      .setTitle(subreddit.title)
      .setDescription(subreddit.public_description)
      .setURL(`https://www.reddit.com/r/${subredditName}/`)
      .setColor(6570404)
      .setThumbnail(subreddit.icon_img)
      .setImage(subreddit.banner_img)
      .addField("Subscribers", subreddit.subscribers.toLocaleString(), true)
      .addField("Users Active", subreddit.accounts_active.toLocaleString(), true);
    return msg.send({ embed });
  }
}

module.exports = SubReddit;
