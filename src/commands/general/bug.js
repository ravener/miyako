const Command = require("../../structures/Command.js");


class Bug extends Command {
  constructor(...args) {
    super(...args, {
      description: "Found a bug? report with this.",
      cooldown: 60,
      usage: "bug <report>",
      aliases: ["reportbug", "bugreport"]
    });
  }
  
  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What is the bug report?");
    const channel = this.client.channels.cache.get("460800229667504148");
    const embed = this.client.embed()
      .setTitle("Bug Report")
      .setDescription(args.join(" "))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setFooter(msg.author.id);

    await channel.send({ embed });
    return msg.send(`Your bug report has been sent${msg.guild && msg.guild.id === this.client.constants.mainGuildID ? "" : " to the support server."} You will hear back from my owner in DMs if there is anything wrong with your report. Have a nice day!`);
  }
}

module.exports = Bug;
