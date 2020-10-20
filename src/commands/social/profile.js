const Command = require("../../structures/Command.js");


class Profile extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your profile or someone's",
      usage: "profile [@user]",
      guildOnly: true
    });
  }

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member, true);
    if(member.user.bot) return msg.send("Baka! You can't view a bot's profile.");

    const embed = this.client.embed()
      .setTitle(`${member.displayName}'s profile`)
      .setDescription(member.user.settings.title || `No Title set yet, use \`${msg.guild.settings.prefix}title\` to set one`)
      .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 64 }))
      .setThumbnail(member.user.displayAvatarURL())
      .addField("Level", member.settings.level)
      .addField("Points", `¥${parseInt(member.settings.points).toLocaleString()}`)
      .addField("Reputation Points", member.user.settings.reputation);
    return msg.send({ embed });
  }
}

module.exports = Profile;
