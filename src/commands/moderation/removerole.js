const Command = require("../../structures/Command.js");

class RemoveRole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Removes a role from someone",
      usage: "<user:member> <role:rolename>",
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
      botPermissions: ["MANAGE_ROLES"],
      aliases: ["roleremove", "rrole", "takerole"]
    });
  }

  async run(msg, [member, ...rolename]) {
    member = await this.verifyMember(msg, member);
    rolename = rolename.join(" ");
    if(!rolename) return msg.send("Baka! You must provide a role to remove.");

    const role = msg.guild.roles.cache.find((role) => (role.id === rolename) || (role.name.toLowerCase() === rolename.toLowerCase()));

    if(!role) return msg.send("That role does not exist.");

    if(msg.member.roles.highest.position <= role.position) return msg.send("You can't remove that role.");
    if(msg.guild.me.roles.highest.position <= role.position) return msg.send("I can't add that role.");

    await member.roles.remove(role);

    return msg.send(`Removed **${role.name}** from **${member.user.tag}**`);
  }
}

module.exports = RemoveRole;
