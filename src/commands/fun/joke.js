const Command = require("../../structures/Command.js");

const fetch = require("node-fetch");

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random joke.",
      cooldown: 3,
      aliases: ["jk"]
    });
  }
  
  async run(msg) {
    const body = await fetch("https://sv443.net/jokeapi/v2/joke/Any")
      .then((r) => r.json());

    if(body.error) return msg.send("Something went wrong with the API. Try again later.");
    const flags = Object.entries(body.flags).filter((x) => x[1]).map((x) => x[0]).join(", ");
    
    const embed = this.client.embed()
      .setTitle(`${body.category}${flags ? ` (${flags})` : ""}`)
      .setDescription(body.type === "single" ? `${body.joke}` : `**${body.setup}**\n*${body.delivery}*`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }));

    return msg.send({ embed });
  }
}

module.exports = Joke;
