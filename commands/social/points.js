const Command = require("../../stuctures/Command.js");

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
    const { rows } = await this.client.db.query("SELECT * FROM members WHERE id = $1 AND guild = $2", [member.id, ctx.guild.id]);
    const points = rows.length ? rows[0].points : 0;
    return ctx.reply(this.client.utils.random(member.id === ctx.author.id ?
      this.client.resposes.balanceMessages : this.client.responses.otherBalanceMessages)
        .replace(/{{user}}/g, member.displayName)
        .replace(/{{amount}}/g, `¥${balance}`));
  }
}

module.exports = Points;
