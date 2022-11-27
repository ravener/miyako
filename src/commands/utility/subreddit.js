const Command = require("../../structures/Command.js");
const { request } = require("undici");

class SubReddit extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["sub", "reddit"],
      description: "Returns information on a subreddit.",
      usage: "subreddit <name>",
      cooldown: 5,
      options: [
        {
          name: "subreddit",
          description: "The subreddit to view",
          type: "string",
          required: true
        }
      ]
    });

    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(ctx, options) {
    let subredditName = options.getString("subreddit");

    if (subredditName.startsWith("r/")) {
      subredditName = subredditName.slice(2);
    }

    const subreddit = await request(`https://www.reddit.com/r/${subredditName}/about.json`)
      .then(({ body }) => body.json())
      .then((body) => {
        if (body.kind === "t5") return body.data;
        throw "That subreddit doesn't exist.";
      })
      .catch(() => { throw this.errorMessage; });

    if (subreddit.over18 && !ctx.nsfw) {
      return ctx.reply("I cannot show 18+ subreddits in this channel. You pervert!");
    }

    const embed = this.client.embed()
      .setTitle(subreddit.title)
      .setDescription(subreddit.public_description)
      .setURL(`https://www.reddit.com/r/${subredditName}/`)
      .addFields({
        name: "Subscribers",
        value: subreddit.subscribers.toLocaleString(),
        inline: true
      })
      .addFields({
        name: "Users Active",
        value: subreddit.accounts_active.toLocaleString(),
        inline: true
      });

    if (subreddit.icon_img) embed.setThumbnail(subreddit.icon_img);
    if (subreddit.banner_img) embed.setImage(subreddit.banner_img);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = SubReddit;
