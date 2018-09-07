const { Event } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Modlogs extends Event {
  
  run(guild, type, data) {
    if(!guild || !guild.settings.modlogs.enabled || !guild.settings.modlogs.channel || !guild.channels.get(guild.settings.modlogs.channel) || !guild.channels.get(guild.settings.modlogs.channel).postable || !guild.channels.get(guild.settings.modlogs.channel).embedable) return;
    if(!guild.settings.get(`modlogs.${data.name}`)) return;
    const channel = guild.channels.get(guild.settings.modlogs.channel);
    if(data.name === "messages" && data.message && data.message.author.id === this.client.user.id) return;
    
    switch(type) {
      case "messageDelete":
        channel.send(this.embed(`📩 Message sent by ${data.message.member} deleted in ${data.message.channel}\n**Content:** ${data.message.content}`, 0xff0000, { title: "Message Deleted", user: data.message.author, image: data.image }));
        break;
      case "inviteDelete":
        channel.send(this.embed(`📩 Invite sent by ${data.message.author} deleted in ${data.message.channel}\n\n**Content:** https://${data.link.base}/${data.link.code}`, 0xff0000, { title: "Invite Link Deleted", user: data.message.author, thumbnail: "user" }));
        break;
      case "memberJoin":
        channel.send(this.embed(`👋 ${data.member.user.tag} Joined\nUser ID: ${data.member.id}\n\n**Member Count**: ${data.member.guild.memberCount}`, "#8089DE", { title: "Member Joined", user: data.member.user, thumbnail: "user" }));
        break;
      case "memberLeave":
        channel.send(this.embed(`👋 ${data.member.user.tag} Left\n**User ID:** ${data.member.id}`, 0xff0000, { user: data.member.user, thumbnail: "user", title: "Member Left" }));
        break;
      case "messageUpdate":
        channel.send(this.embed(`📝 Message by ${data.message.member} edited in ${data.message.channel}\n\n**Content Before:** ${data.old.content}\n\n**Content Now:** ${data.message.content}`, "#8089DE", { title: "Message Edited", user: data.message.author }));
        break;
      case "kick":
        channel.send(this.embed(`👢 **Member ${data.member.user.tag} got kicked by ${data.kicker}**.\n\n**Reason:** ${data.reason ? data.reason : "None"}`, 0xff0000, { title: "Member Kicked", user: data.member.user, thumbnail: "user" }));
        break;
      case "ban":
        channel.send(this.embed(`🔨 ${data.user.tag} got **banned**\n\n**User ID:** ${data.user.id}\n**Reason:** ${data.reason || "None"}`, 0xff0000, { title: "Member Banned", user: data.user, thumbnail: "user" }));
        break;
      case "unban":
        channel.send(this.embed(`✌ ${data.user.tag} got **unbanned**\n**User ID:** ${data.user.id}`, "#8089DE", { user: data.user, title: "Member Unbanned", thumbnail: "user" }));
        break;
      case "invite":
        channel.send(this.embed(`❕ Invite link posted in ${data.message.channel} by ${data.message.author}\n\n**Invite Information**\n**URL:** https://${data.link.base}/${data.link.code}${data.link.data && data.link.data.guild ? `\n**Server:** ${data.link.data.guild.name}\n**Server ID:** ${data.link.data.guild.id}` : ""}${data.link.data ? `\n**Channel:** ${data.link.data.channel.name}\n**Channel ID:** ${data.link.data.channel.id}` : ""}${data.link.data && data.link.data.inviter ? `\n**Inviter:** ${data.link.data.inviter.tag}\n**Inviter ID:** ${data.link.data.inviter.id}` : ""}`, "#8089DE", { title: "Invite Posted.", user: data.message.author, thumbnail: data.link.data && data.link.data.guild ? data.link.data.guild.iconURL() : null }));
        break;
      case "purge":
        channel.send(this.embed(`📩 **${data.messages.size}** messages purged in ${data.messages.first().channel}`, "#8089DE", { title: "Messages Purged" }));
        break;
      case "channelCreate":
        channel.send(this.embed(`👌 **New channel created**\n\n**Name:** ${data.channel.name} (${data.channel})\n**ID:** ${data.channel.id}`, "#8089DE", { title: "Channel Create" }));
        break;
      case "channelDelete":
        channel.send(this.embed(`❌ **Channel Deleted**\n\n**Name:** ${data.channel.name}\n**ID:** ${data.channel.id}`, 0xff0000, { title: "Channel Delete" }));
        break;
      case "channelUpdate":
        channel.send(this.embed(`🆙 **Channel Updated**\n**Channel:** ${data.channel.name} (${data.channel})\n**Channel ID:** ${data.channel.id}\n\n**Changes**\n${data.changes.map((x) => `**${x.field}**\nBefore: ${x.old}\nNow: ${x.now}\n\n`)}`, "#8089DE", { title: "Channel Update" }));
        break;
      case "roleCreate":
        channel.send(this.embed(`**New Role Created**\n\n**Name:** ${data.role.name}\n**ID:** ${data.role.id}\n**Color:** ${data.role.hexColor}`, "#8089DE", { title: "Role Created" }));
        break;
      case "roleDelete":
        channel.send(this.embed(`**Role deleted**\n\n**Name:** ${data.role.name}\n**ID:** ${data.role.id}\n**Color:** ${data.role.hexColor}`, 0xff0000, { title: "Role Delete" }));
        break;
      case "warn":
        channel.send(this.embed(`**${data.user.user.tag}** got warned by **${data.mod.user.tag}**\n\n**Reason:** ${data.reason}\n**User ID:** ${data.user.id}`, 0xff0000, { title: "Member Warn", user: data.user, thumbnail: "user" }));
        break;
      case "mute":
        channel.send(this.embed(`**${data.user.tag}** got muted by **${data.muter.tag}**\n\n**Reason:** ${data.reason || "None"}\n**User ID:** ${data.user.id}`, 0xff0000, { title: "Member Muted", user: data.user, thumbnail: "user" }));
        break;
      case "unmute":
        channel.send(this.embed(`**${data.user.tag}** got unmuted by **${data.unmuter.tag}**\n\n**User ID:** ${data.user.id}`, "#8089DE", { title: "Member Unmuted", user: data.user, thumbnail: "user" }));
        break;
      default:
        this.client.emit("warn", `WARNING: unhandled modlog action: ${type}`);
        break;
    }
  }
  
  embed(text, color, data = {}) {
    
    const embed = new MessageEmbed()
      .setTitle(data.title)
      .setDescription(text)
      .setColor(color)
      .setTimestamp();
      
    if(data.user) embed.setAuthor(data.user.tag, data.user.displayAvatarURL());
    
    if(data.thumbnail === "user" && data.user) embed.setThumbnail(data.user.displayAvatarURL({ size: 1024 }));
    else if(data.thumbnail) embed.setThumbnail(data.thumbnail);
    
    if(data.image) embed.setImage(data.image);
    if(data.footer) embed.setFooter(data.footer);
    return embed;
  }
}

module.exports = Modlogs;
