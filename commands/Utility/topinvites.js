const { Command } = require("klasa");

class TopInvites extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ["text"],
      aliases: ["ti"],
      requiredPermissions: ["MANAGE_GUILD"],
      description: "Shows the top invites in a server."
    });
  }

  async run(msg) {
    const invites = await msg.guild.fetchInvites();
    const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);
    if (topTen.length === 0) throw "There are no invites, or none of them have been used!";
    return msg.sendMessage(
      topTen.map((inv) => `**${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** uses.`)
    );
  }
}

module.exports = TopInvites;