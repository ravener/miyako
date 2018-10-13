const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Profile extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your profile or someone's",
      usage: "[user:member]",
      runIn: ["text"]
    });
  }

  async run(msg, [member = msg.member]) {
    if(member.user.bot) throw "You can't view a bot's profile";
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s profile`)
      .setDescription(member.user.settings.title || `No Title set yet, use \`${msg.guild.settings.prefix}title\` to set one`)
      .setColor(0xff0000)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .addField("Level", member.settings.level)
      .addField("Points", `${member.settings.points.toLocaleString()} ${this.client.constants.currency}`)
      .addField("Reputation Points", member.user.settings.reps);
    return msg.send({ embed });
  }
}

module.exports = Profile;
