const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Permissions extends Command {
  constructor(...args) {
    super(...args, {
      description: "View all permissions of a User.",
      usage: "permissions [user]",
      guildOnly: true,
      aliases: ["perms"]
    });
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, user, true);
    return ctx.reply(new MessageEmbed()
      .setTitle(`${member.displayName}'s Permissions in ${ctx.guild.name}`)
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 256 }))
      .setDescription(Object.entries(member.permissions.serialize()
        .map((perms) => `${perms[1] ? ":white_checkmark:" : ":x:"} ${this.client.events.get("message").friendlyPerms[perms[0]]}`)
        .join("\n"))));
  }
}

module.exports = Permissions;
