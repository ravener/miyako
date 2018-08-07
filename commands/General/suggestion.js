const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: "Got a suggestion to improve the bot?",
      usage: "<suggestion:string{,1500}>",
      aliases: ["suggest"],
      cooldown: 60,
      guarded: true
    });
  }
  
  async run(msg, [suggestion]) {
    const guild = this.client.guilds.get("397479560876261377");
    const channel = guild.channels.get("460801007769616394");
    const embed = new MessageEmbed()
      .setTitle("New Suggestion")
      .setDescription(suggestion)
      .setColor(0xff0000)
      .setThumbnail(msg.author.displayAvatarURL())
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setFooter(`User ID: ${msg.author.id}`);
    const message = await channel.send({ embed });
    await message.react(guild.emojis.get("466669198463074305"));
    await message.react(guild.emojis.get("466669201025925120"));
    return msg.send(`Your idea has been successfully submitted${msg.guild.id !== guild.id ? " to the support server" : ""}.`);
  }
}

module.exports = Suggestion;