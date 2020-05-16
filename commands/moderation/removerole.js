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

  async run(ctx, [member, ...rolename]) {
    member = await this.verifyMember(ctx, member);
    rolename = rolename.join(" ");
    if(!rolename) return ctx.reply("Baka! You must provide a role to remove.");

    const role = ctx.guild.roles.cache.find((role) => (role.id === rolename) || (role.name.toLowerCase() === rolename.toLowerCase()));

    if(!role) return ctx.reply("That role does not exist.");

    if(ctx.member.roles.highest.position <= role.position) return ctx.reply("You can't remove that role.");
    if(ctx.guild.me.roles.highest.position <= role.position) return ctx.reply("I can't add that role.");

    await member.roles.remove(role);

    return ctx.reply(`Removed **${role.name}** from **${member.user.tag}**`);
  }
}

module.exports = RemoveRole;
