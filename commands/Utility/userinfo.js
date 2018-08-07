const { Command, Timestamp } = require("klasa");
const { MessageEmbed } = require("discord.js");

class UserInfo extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get information on a mentioned user.",
      usage: "[Member:member]",
      runIn: ["text"],
      aliases: ["ui", "user"]
    });
    
    this.statuses = {
      online: "💚 Online",
      idle: "💛 Idle",
      dnd: "❤ Do Not Disturb",
      offline: "💔 Offline"
    };
    this.timestamp = new Timestamp("d MMMM YYYY");
  }
  
  async run(msg, [member = msg.member]) {
    const days = Math.floor((new Date() - member.user.createdAt) / (1000 * 60 * 60 * 24));
    const joinedDays = Math.floor((new Date() - member.joinedAt) / (1000 * 60 * 60 * 24));
    const embed = new MessageEmbed()
      .setColor(member.displayHexColor || 0xff0000)
      .setThumbnail(member.user.displayAvatarURL())
      .addField("❯ Name", member.user.tag, true)
      .addField("❯ ID", member.id, true)
      .addField("❯ Discord Join Date", `${this.timestamp.display(member.user.createdAt)} (${days} ago!)`, true)
      .addField("❯ Server Join Date", `${this.timestamp.display(member.joinedTimestamp)} (${joinedDays} ago!)`, true)
      .addField("❯ Status", this.statuses[member.presence.status], true)
      .addField("❯ Playing", member.presence.activity ? member.presence.activity.name : "N/A", true)
      .addField("❯ Bot?", member.user.bot ? "Yes" : "No", true)
      .addField("❯ Highest Role", member.roles.size > 1 ? member.roles.highest.name : "None", true)
      .addField("❯ Hoist Role", member.roles.hoist ? member.roles.hoist.name : "None", true);
    return msg.send({ embed });
  }
}

module.exports = UserInfo;