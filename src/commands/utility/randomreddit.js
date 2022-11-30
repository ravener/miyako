const Command = require("../../structures/Command.js");
const { request } = require("undici");

class RandomReddit extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random reddit post on a given subreddit.",
      usage: "randomreddit <subreddit>",
      aliases: ["rreddit", "randreddit"],
      cooldown: 3,
      cost: 3,
      options: [
        {
          name: "subreddit",
          description: "The subreddit the fetch a random post from.",
          type: "string",
          required: true
        }
      ]
    });

    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(ctx, options) {
    let subreddit = options.getString("subreddit");

    if (subreddit.startsWith("r/")) {
      subreddit = subreddit.slice(2);
    }

    const data = await request(`https://www.reddit.com/r/${subreddit}/random.json`)
      .then(({ body }) => body.json())
      .then((body) => {
        if (body.error) throw this.errorMessage;
        return body[0].data.children[0].data;
      })
      .catch(() => { throw this.errorMessage; });

    if (data.over_18 && !ctx.nsfw) {
      return ctx.reply("The results I found was NSFW and I cannot post it in this channel.");
    }

    return ctx.reply(`${data.title} ${data.url}`);
  }
}

module.exports = RandomReddit;
