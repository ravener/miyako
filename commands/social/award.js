const Command = require("../../structures/Command.js");

class Award extends Command {
  constructor(...args) {
    super(...args, {
      description: "Award points to someone.",
      userPermissions: ["ADMINISTRATOR"],
      cooldown: 30,
      usage: "award <@user> <amount>",
      aliases: ["give", "reward"],
      guildOnly: true
    });
  }
  
  async run(ctx, [member, amount]) {
    member = await this.verifyMember(ctx, member);
    amount = this.verifyInt(amount);

    if(member.user.bot) return ctx.reply("Baka! Bots can't have points.");
    if(member.user.id === ctx.author.id) return ctx.reply("Baka! You can't reward yourself. Why did you even try it?");
    
    if(amount < 0) return ctx.rely("Baka! You can't reward them a negative amount. Are you trying to rob them?");
    if(amount === 0) return ctx.reply("Baka! Why would you pay them nothing?");
    if(amount >= 100000) return ctx.reply("You can't reward more than 100,000 at a time.");

    await member.syncSettings();
    await member.givePoints(amount);

    return ctx.reply(`Successfully rewarded **¥${amount.toLocaleString()}** to ${member}`);
  }
}

module.exports = Award;
