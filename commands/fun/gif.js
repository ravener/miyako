const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class GIF extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search a gif from giphy",
      usage: "gif <query>",
      cooldown: 5
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What am I supposed to search?");

    const data = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.client.config.giphy}&limit=1&q=${encodeURIComponent(args.join(" "))}`)
      .then((res) => res.json())
      .then((body) => body.data[0])

    if(!data) return ctx.reply("No Results Found.");
    return ctx.reply(data.embed_url);
  }
}

module.exports = GIF;
