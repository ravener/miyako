const { Command } = require("klasa");

class RemoveRole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Removes a role from someone",
      usage: "<user:member> <role:rolename>",
      permissionLevel: 6,
      usageDelim: " ",
      runIn: ["text"],
      requiredPermissions: ["MANAGE_ROLES"],
      aliases: ["roleremove", "rrole", "takerole"],
      quotedStringSupport: true
    });
  }

  async run(msg, [member, role]) {
    if(msg.member.roles.highest.position <= role.position) throw "You can't remove that role.";
    if(msg.guild.me.roles.highest.position <= role.position) throw "I can't add that role.";
    await member.roles.remove(role);
    return msg.send(`Removed **${role.name}** from **${member.displayName}**`);
  }
}

module.exports = RemoveRole;
