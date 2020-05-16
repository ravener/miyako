const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class RandomReddit extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random reddit post on a given subreddit.",
      usage: "randomreddit <subreddit>",
      aliases: ["rreddit", "randreddit"],
      cooldown: 3,
      cost: 3
    });

    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(ctx, [subreddit]) {
    if(!subreddit) return ctx.reply("Baka! You must provide a subreddit to fetch from.");

    const data = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`)
      .then((res) => res.json())
      .then((body) => {
        if(body.error) throw this.errorMessage;
        return body[0].data.children[0].data;
      })
      .catch(() => { throw this.errorMessage; });

    if(data.over_18 && !ctx.channel.nsfw) {
      return ctx.reply("The results I found was NSFW and I cannot post it in this channel.");
    }

    return ctx.reply(`${data.title} ${data.url}`);
  }
}

module.exports = RandomReddit;
