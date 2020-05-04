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
    member = await this.verifyMember(ctx, member, true);
    return ctx.reply(new MessageEmbed()
      .setTitle(`${member.displayName}'s Permissions in #${ctx.channel.name} in ${ctx.guild.name}`)
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setDescription(Object.entries(ctx.channel.permissionsFor(member).serialize())
        .map((perms) => `${perms[1] ? "<:checkmark:703661431484317836>" : "<:crossmark:703661490686656522>"} ${
          this.client.events.get("message").friendlyPerms[perms[0]]}`)
        .join("\n")));
  }
}

module.exports = Permissions;
