const Command = require("../../structures/Command.js");


class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: "Got a suggestion to improve the bot?",
      usage: "suggestion <idea>",
      aliases: ["suggest"],
      cooldown: 60
    });
  }
  
  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What's your idea?");

    const channel = this.client.channels.cache.get("460801007769616394");

    const embed = this.client.embed()
      .setTitle("New Suggestion")
      .setDescription(args.join(" "))
      .setThumbnail(msg.author.displayAvatarURL({ size: 512 }))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 512 }))
      .setFooter(`User ID: ${msg.author.id}`);

    const message = await channel.send({ embed });
    await message.react("466669198463074305");
    await message.react("466669201025925120");
    return msg.send(`Your idea has been successfully submitted${msg.guild && msg.guild.id !== this.client.constants.mainGuildID ? " to the support server" : ""}.`);
  }
}

module.exports = Suggestion;
