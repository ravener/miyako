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
  
  async run(ctx, [member, ...rolename]) {
    member = await this.verifyMember(ctx, member);
    rolename = rolename.join(" ");
    if(!rolename) return ctx.reply("Baka! You must provide the name or ID of the role you want to add.");

    // TODO: Add some role helper.
    const role = ctx.guild.roles.cache.find((role) => (role.id === rolename) || (role.name.toLowerCase() === rolename.toLowerCase()));
    if(!role) return ctx.reply("That role does not exist!");

    if(ctx.member.roles.highest.position <= role.position) return ctx.reply("You cannot add that role.");
    if(role.position >= ctx.guild.me.roles.highest.position) return ctx.reply("I can't add that role.");

    await member.roles.add(role);

    return ctx.reply(`Added **${role.name}** to **${member.user.tag}**`);
  }
}

module.exports = AddRole;
