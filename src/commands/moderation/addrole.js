const Command = require("../../structures/Command.js");

class AddRole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Adds a role to someone",
      aliases: ["arole", "roleadd", "giverole"],
      botPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
      usage: "addrole <@user> <rolename>"
    });
  }
  
  async run(msg, [member, ...rolename]) {
    member = await this.verifyMember(msg, member);
    rolename = rolename.join(" ");
    if(!rolename) return msg.send("Baka! You must provide the name or ID of the role you want to add.");

    // TODO: Add some role helper.
    const role = msg.guild.roles.cache.find((role) => (role.id === rolename) || (role.name.toLowerCase() === rolename.toLowerCase()));
    if(!role) return msg.send("That role does not exist!");

    if(msg.member.roles.highest.position <= role.position) return msg.send("You cannot add that role.");
    if(role.position >= msg.guild.me.roles.highest.position) return msg.send("I can't add that role.");

    await member.roles.add(role);

    return msg.send(`Added **${role.name}** to **${member.user.tag}**`);
  }
}

module.exports = AddRole;
