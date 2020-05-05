const Command = require("../../structures/Command.js");

class Pay extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your balance.",
      cooldown: 3,
      usage: "pay <@member> <amount>",
      guildOnly: true,
      aliases: ["transfer", "donate"]
    });
  }

  async run(ctx, [member, amount]) {
    member = await this.verifyMember(ctx, member);
    amount = this.verifyInt(amount);

    if(member.id === ctx.author.id) return ctx.reply("Baka! Why would you pay yourself?");
    if(member.user.bot) return ctx.reply("Baka! You can't pay bots.");
    if(amount > parseInt(ctx.member.settings.points)) return ctx.reply("Baka! You can't pay more than what you have!");
    if(amount < 1) return ctx.reply("Baka! Why would you pay nothing?");
    if(amount > Number.MAX_SAFE_INTEGER) return ctx.reply("Baka! That amount is too high!");

    await member.syncSettings();
    await ctx.member.takePoints(amount);
    await member.givePoints(amount);

    return ctx.reply(`Paid **¥${amount.toLocaleString()}** to **${member.displayName}**`);
  }
}

module.exports = Pay;
