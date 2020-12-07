const Command = require("../../structures/Command.js");


class Permissions extends Command {
  constructor(...args) {
    super(...args, {
      description: "View all permissions of a User.",
      usage: "permissions [user]",
      guildOnly: true,
      aliases: ["perms"]
    });
  }

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member, true);
    return msg.send(this.client.embed()
      .setTitle(`${member.displayName}'s Permissions in #${msg.channel.name} in ${msg.guild.name}`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setDescription(Object.entries(msg.channel.permissionsFor(member).serialize())
        .map((perms) => `${perms[1] ? "<:checkmark:703661431484317836>" : "<:crossmark:703661490686656522>"} ${
          this.client.monitors.get("command").friendlyPerms[perms[0]]}`)
        .join("\n")));
  }
}

module.exports = Permissions;
