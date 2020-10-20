const Command = require("../../structures/Command.js");

class Points extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your or someone's balance.",
      usage: "balance [@user]",
      guildOnly: true,
      aliases: ["balance", "bal", "score"]
    });
  }

  async run(msg, [user]) {
    const member = await this.verifyMember(msg, user, true);
    if(member.user.bot) return msg.send("Baka! Bots don't have points.");
    await member.syncSettings();

    return msg.send(this.client.utils.random(member.id === msg.author.id ?
      this.client.responses.balanceMessages : this.client.responses.otherBalanceMessages)
      .replace(/{{user}}/g, member.displayName)
      .replace(/{{amount}}/g, `¥${parseInt(member.settings.points).toLocaleString()}`));
  }
}

module.exports = Points;
