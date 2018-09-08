const { Command } = require("klasa");

class Unmute extends Command {
  constructor(...args) {
    super(...args, {
      description: "Unmutes a muted user",
      permissionLevel: 6,
      usage: "<member:member>",
      runIn: ["text"],
      requiredPermissions: ["MANAGE_ROLES"]
    });
  }

  async run(msg, [member]) {
    if(!msg.guild.settings.roles.muted) throw `Couldn't find the muted role to assign, set the muted role using \`${msg.guild.settings.prefix}conf set roles.muted <rolename>\``;
    const role = msg.guild.roles.get(msg.guild.settings.roles.muted);
    if(!role) throw `Couldn't find the muted role to assign, set the muted role using
 \`${msg.guild.settings.prefix}conf set roles.muted <rolename>\``;
    if(!member.roles.has(role.id)) throw "That user isn't muted.";
    if(role.position >= msg.guild.me.roles.highest.position) throw "I can't remove the muted role, make sure my role position is higher than the muted role";
    await member.roles.remove(role);
    this.client.emit("modlogs", msg.guild, "unmute", { name: "mute", user: member.user, unmuter: msg.author });
    return msg.send(`Unmuted **${member.displayName}**`);
  }
}

module.exports = Unmute;
