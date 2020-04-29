const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Daily extends Command {
  constructor(...args) {
    super(...args, {
      description: "Claims your daily points.",
      extendedHelp: "You can give/donate your daily for others and it will reward bonus for them.",
      guildOnly: true,
      usage: "daily [userToDonate]",
      aliases: ["dailies", "dailycredits", "dailypoints"]
    });
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member, true);

    if(ctx.member.settings.daily && (Date.now() < ctx.member.settings.daily))
      return ctx.reply(this.client.utils.random(this.client.responses.dailyFailureMessages)
        .replace(/{{user}}/g, ctx.member.displayName)
        .replace(/{{time}}/g, this.client.utils.getDuration(ctx.member.settings.daily - Date.now())));

    if(member.id !== ctx.member.id) {
      if(member.user.bot) throw "Baka! You can't give your daily points to a bot!";
      await this.setCooldown(ctx);
      await member.syncSettings();
      await member.givePoints(750);
      return ctx.reply(`You have given your daily to **${member.displayName}**. As a bonus they get **¥750**`);
    }

    let amount = 500;
    const voted = await this.client.dbl.hasVoted(ctx.author.id);
    const weekend = await this.client.dbl.isWeekend();
    if(!voted) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 256 }))
        .setDescription(`Have you upvoted today?\n\nAn upvote will double your daily claim **on every server** you share with Miyako.${weekend ? " Additionally today is the weekend! Giving you the opportunity to earn **4x** The rewards." : ""}\n\nClick [Here](https://top.gg/bot/${this.client.user.id}/vote) to upvote for the bonus.\n\nDo you wish to claim your daily anyway without voting? (**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`)
        .setTimestamp()
        .setColor(0x9590EE);
      
      const filter = (msg) => msg.author.id === ctx.author.id;
      const response = await ctx.message.awaitReply("", filter, 60000, embed);
      if(!response) return ctx.reply("No reply within 60 seconds. Time out.");

      if(["yes", "y", "confirm", "ok"].includes(response.toLowerCase())) {
        await ctx.member.givePoints(amount);
        await this.setCooldown(ctx);
        return ctx.reply(this.client.utils.random(this.client.responses.dailySuccessMessages)
          .replace(/{{user}}/g, ctx.member.displayName)
          .replace(/{{amount}}/g, `¥${amount.toLocaleString()}`));
      } else if(["no", "n", "cancel"].includes(response)) {
        return ctx.reply("Claim cancelled.");
      } else {
        return ctx.reply("Invalid response, please try again.");
      }
    }

    amount *= 2;
    if(weekend) amount *= 2;

    await ctx.member.givePoints(amount);
    await this.setCooldown(ctx);

    return ctx.reply(this.client.utils.random(this.client.responses.dailySuccessMessages)
      .replace(/{{user}}/g, ctx.member.displayName)
      .replace(/{{amount}}/g, `¥${amount.toLocaleString()}`));
  }

  setCooldown(ctx) {
    const id = `${ctx.guild.id}.${ctx.author.id}`;
    return this.client.members.update(id, { daily: new Date(ctx.message.createdTimestamp + 86400000) })
  }
}

module.exports = Daily;
