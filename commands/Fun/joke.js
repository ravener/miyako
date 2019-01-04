const { Command, util: { toTitleCase } } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random joke.",
      cooldown: 3
    });
  }
  
  async run(msg) {
    const { body } = await ladybug("https://official-joke-api.herokuapp.com/random_joke");
    const embed = new MessageEmbed()
      .setTitle(`${toTitleCase(body.type)} #${body.id}`)
      .setDescription(`**${body.setup}**\n*${body.punchline}*`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Joke;
