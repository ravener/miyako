const { Command, util: { toTitleCase } } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random joke.",
      cooldown: 3
    });
  }
  
  async run(msg) {
    const { body } = await superagent.get("https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke");
    const embed = new MessageEmbed()
      .setTitle(`${toTitleCase(body.type)} #${body.id}`)
      .setDescription(`**${body.setup}**\n*${body.punchline}*`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Joke;