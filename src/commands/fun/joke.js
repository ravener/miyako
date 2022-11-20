const Command = require("../../structures/Command.js");
const { request } = require("undici");

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random joke.",
      cooldown: 3,
      aliases: ["jk"]
    });
  }
  
  async run(ctx) {
    const body = await request("https://sv443.net/jokeapi/v2/joke/Any")
      .then(({ body }) => body.json());

    if (body.error) {
      return ctx.reply("Something went wrong with the API. Try again later.");
    }

    const flags = Object.entries(body.flags).filter((x) => x[1]).map((x) => x[0]).join(", ");
    
    const embed = this.client.embed(ctx.author)
      .setTitle(`${body.category}${flags ? ` (${flags})` : ""}`)
      .setDescription(body.type === "single" ? `${body.joke}` : `**${body.setup}**\n*${body.delivery}*`);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Joke;
