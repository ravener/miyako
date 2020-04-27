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

  async run(ctx, [user]) {
    const member = await this.verifyMember(ctx, user, true);
    if(member.user.bot) return ctx.reply("Baka! Bots don't have points.");
    const points = await member.getBalance();

    return ctx.reply(this.client.utils.random(member.id === ctx.author.id ?
      this.client.responses.balanceMessages : this.client.responses.otherBalanceMessages)
        .replace(/{{user}}/g, member.displayName)
        .replace(/{{amount}}/g, `¥${points}`));
  }
}

module.exports = Points;
