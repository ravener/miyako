const Command = require("../../structures/Command.js");


class TopInvites extends Command {
  constructor(...args) {
    super(...args, {
      guildOnly: true,
      aliases: ["ti"],
      botPermissions: ["MANAGE_GUILD"],
      description: "Shows the top invites in a server."
    });
  }

  async run(msg) {
    const invites = await msg.guild.fetchInvites();
    const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);

    if(topTen.length === 0) return msg.send("There are no invites, or none of them have been used!");

    return msg.send(this.client.embed()
      .setTitle(`Top Invites in ${msg.guild.name}`)
      .setAuthor(msg.guild.name, msg.guild.iconURL())
      .setDescription(topTen.map((inv) => `• **${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** uses.`).join("\n")));
  }
}

module.exports = TopInvites;
