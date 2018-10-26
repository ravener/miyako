const { Command } = require("klasa");

class Mute extends Command {
  constructor(...args) {
    super(...args, {
      description: "Mute someone",
      usage: "<user:member> [reason:string] [...]",
      usageDelim: " ",
      permissionLevel: 6,
      runIn: ["text"]
    });
  }

  async run(msg, [member, ...reason]) {
    if(member.id === this.client.user.id) throw "Why do you want to mute me?";
    if(member.id === msg.member.id) throw "Why are you muting yourself?";
    if(member.id === msg.guild.owner.id) throw "You can't mute the owner!";
    if(member.permissions.has("ADMINISTRATOR")) throw "I can't mute people with Administrator permissions.";
    if(!msg.guild.settings.roles.muted) throw `Couldn't find the muted role to assign, set the muted role using \`${msg.guild.settings.prefix}conf set roles.muted <rolename>\``;
    const role = msg.guild.roles.get(msg.guild.settings.roles.muted);
    if(!role) throw `Couldn't find the muted role to assign, set the muted role using \`${msg.guild.settings.prefix}conf set roles.muted <rolename>\``;
    if(member.roles.has(role.id)) throw "That user is already muted.";
    if(role.position >= msg.guild.me.roles.highest.position) throw "I can't add the muted role, make sure my role position is above it";
    for(const channel of msg.guild.channels.array()) {
      if(channel.permissionsFor(role).has(["SEND_MESSAGES", "ADD_REACTIONS"]) || (channel.type === "voice" && channel.permissionsFor(role).has("CONNECT"))) {
        await channel.updateOverwrite(role, { SEND_MESSAGES: false, ADD_REACTIONS: false, CONNECT: false }, "Mute Command");
      }
    }
    await member.roles.add(role);
    this.client.emit("modlogs", msg.guild, "mute", { name: "mute", user: member.user, reason: reason.join(" "), muter: msg.author });
    return msg.send(`Muted **${member.displayName}**${reason.length ? ` with reason of: ${reason.join(" ")}` : ""}`);
  }
}

module.exports = Mute;
