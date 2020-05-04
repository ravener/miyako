const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random joke.",
      cooldown: 3,
      aliases: ["jk"]
    });
  }
  
  async run(ctx) {
    const body = await fetch("https://sv443.net/jokeapi/v2/joke/Any")
      .then((r) => r.json());

    if(body.error) return ctx.reply("Something went wrong with the API. Try again later.");
    const flags = Object.entries(body.flags).filter((x) => x[1]).map((x) => x[0]).join(", ");
    
    const embed = new MessageEmbed()
      .setTitle(`${body.category}${flags ? ` (${flags})` : ""}`)
      .setDescription(body.type === "single" ? `${body.joke}` : `**${body.setup}**\n*${body.delivery}*`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE);

    return ctx.reply({ embed });
  }
}

module.exports = Joke;
