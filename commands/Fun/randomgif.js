const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");

class RandomGIF extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random gif from giphy",
      usage: "[tag:string]",
      aliases: ["rgif"],
      cooldown: 3
    });
  }

  async run(msg, [tag]) {
    await msg.send("Searching...");
    /* eslint-disable camelcase */
    const api_key = this.client.config.giphy;
    const req = ladybug("https://api.giphy.com/v1/gifs/random")
      .query({ api_key });
    if(tag) req.query({ tag });
    const res = await req;
    return msg.send(res.body.data.embed_url);
    /* eslint-enable camelcase */
  }
}

module.exports = RandomGIF;
