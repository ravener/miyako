const { Command } = require("klasa");

class AddRole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Adds a role to someone",
      aliases: ["arole", "roleadd", "giverole"],
      permissionLevel: 6,
      requiredPermissions: ["MANAGE_ROLES"],
      runIn: ["text"],
      usage: "<user:member> <role:rolename>",
      usageDelim: " "
    });
  }
  
  async run(msg, [user, role]) {
    if(msg.member.roles.highest.position <= role.position) throw "You cannot add that role.";
    if(role.position >= msg.guild.me.roles.higest.position) throw "I can't add that role.";
    await user.roles.add(role);
    return msg.send(`Added **${role.name}** to **${user.user.tag}**`);
  }
}

module.exports = AddRole;
