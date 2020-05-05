const Command = require("../../structures/Command.js");

class Deduct extends Command {
  constructor(...args) {
    super(...args, {
      description: "Deduct someone's points.",
      userPermissions: ["ADMINISTRATOR"],
      cooldown: 30,
      usage: "deduct <@user> <amount>",
      aliases: ["punish", "take"],
      guildOnly: true,
      cost: 5
    });
  }
  
  async run(ctx, [member, amount]) {
    member = await this.verifyMember(ctx, member);
    amount = this.verifyInt(amount);

    if(member.user.bot) return ctx.reply("Baka! Bots can't have points.");
    if(member.user.id === ctx.author.id) return ctx.reply("Baka! You can't punish yourself. Why did you even try it?");
    
    if(amount < 0) return ctx.rely("Baka! You can't deduct a negative amount.");
    if(amount === 0) return ctx.reply("Baka! Why would you deduct nothing?");

    // Synchronize settings before reading points.
    await member.syncSettings();

    if(parseInt(member.settings.points) < amount) return ctx.reply("Baka! You can't deduct more than their balance.");

    await member.takePoints(amount);

    return ctx.reply(`Successfully deducted **¥${amount.toLocaleString()}** from ${member}`);
  }
}

module.exports = Deduct;
