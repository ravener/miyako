const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class UserInfo extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get information on a mentioned user.",
      usage: "userinfo [@user]",
      guildOnly: true,
      aliases: ["ui", "user"]
    });
    
    this.statuses = {
      online: "<:online:473263910045351957> Online",
      idle: "<:idle:473264190346493964> Idle",
      dnd: "<:dnd:473264076852559873> Do Not Disturb",
      offline: "Offline"
    };
  }
  
  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true);
    const days = Math.floor((new Date() - member.user.createdAt) / (1000 * 60 * 60 * 24));
    const joinedDays = Math.floor((new Date() - member.joinedAt) / (1000 * 60 * 60 * 24));

    const embed = new MessageEmbed()
      .setColor(member.displayHexColor || 0x9590EE)
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .addField("❯ Name", member.user.tag, true)
      .addField("❯ ID", member.id, true)
      .addField("❯ Discord Join Date", `${member.user.createdAt.toDateString()} (${days} days ago!)`, true)
      .addField("❯ Server Join Date", `${member.joinedAt.toDateString()} (${joinedDays} days ago!)`, true)
      .addField("❯ Status", this.statuses[member.presence.status], true)
      .addField("❯ Bot", member.user.bot ? "Yes" : "No", true)
      .addField("❯ Highest Role", member.roles.cache.size > 1 ? member.roles.highest.name : "None", true)
      .addField("❯ Hoist Role", member.roles.hoist ? member.roles.hoist.name : "None", true);
    return ctx.reply({ embed });
  }
}

module.exports = UserInfo;
