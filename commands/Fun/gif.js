const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");

class GIF extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search a gif from giphy",
      usage: "<query:string>",
      cooldown: 3
    });
  }

  async run(msg, [q]) {
    await msg.send("Searching...");
    /* eslint-disable camelcase */
    const api_key = this.client.config.giphy;
    const res = await ladybug("https://api.giphy.com/v1/gifs/search")
      .query({ q, api_key, limit: 1 });
    const data = res.body.data[0];
    if(!data) throw "No Results Found.";
    return msg.send(data.embed_url);
    /* eslint-enable camelcase */
  }
}

module.exports = GIF;
