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

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What am I supposed to search?");

    const data = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY}&limit=1&q=${encodeURIComponent(args.join(" "))}`)
      .then((res) => res.json())
      .then((body) => body.data[0]);

    if(!data) return msg.send("No Results Found.");
    return msg.send(data.embed_url);
  }
}

module.exports = GIF;
