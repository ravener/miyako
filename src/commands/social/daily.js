const Command = require("../../structures/Command.js");


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

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member, true);

    if (msg.member.settings.daily && (Date.now() < msg.member.settings.daily))
      return msg.send(this.client.utils.random(this.client.responses.dailyFailureMessages)
        .replace(/{{user}}/g, msg.member.displayName)
        .replace(/{{time}}/g, this.client.utils.getDuration(msg.member.settings.daily - Date.now())));

    if (member.id !== msg.member.id) {
      if (member.user.bot) throw "Baka! You can't give your daily points to a bot!";
      await this.setCooldown(msg);
      await member.syncSettings();
      await member.givePoints(750);
      return msg.send(`You have given your daily to **${member.displayName}**. As a bonus they get **¥750**`);
    }

    let amount = 500;
    const voted = await this.client.dbl.hasVoted(msg.author.id);
    const weekend = await this.client.dbl.isWeekend();
    const premium = await this.client.verifyPremium(msg.author);

    if (!voted) {
      const embed = this.client.embed(msg.author)
        .setDescription(`Have you upvoted today?\n\nAn upvote will double your daily claim **on every server** you share with Miyako.${weekend ? " Additionally today is the weekend! Giving you the opportunity to earn **4x** The rewards." : ""}\n\nClick [Here](https://top.gg/bot/${this.client.user.id}/vote) to upvote for the bonus.\n\nDo you wish to claim your daily anyway without voting? (**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`)
        .setTimestamp();
      
      const filter = (m) => m.author.id === msg.author.id;
      const response = await msg.awaitReply("", filter, 60000, embed);
      if (!response) return msg.send("No reply within 60 seconds. Time out.");

      if (["yes", "y", "confirm", "ok"].includes(response.toLowerCase())) {
        if (premium) amount += 250;
        await msg.member.givePoints(amount);
        await this.setCooldown(msg);
        return msg.send(this.client.utils.random(msg.language.get("DAILY_SUCCESS_MESSAGES"))
          .replace(/{{user}}/g, msg.member.displayName)
          .replace(/{{amount}}/g, `¥${amount.toLocaleString()}`));
      } else if (["no", "n", "cancel"].includes(response)) {
        return msg.send("Claim cancelled.");
      } else {
        return msg.send("Invalid response, please try again.");
      }
    }

    amount *= 2;
    if (weekend) amount *= 2;
    if (premium) amount += 250;

    await msg.member.givePoints(amount);
    await this.setCooldown(msg);

    return msg.send(this.client.utils.random(msg.language.get("DAILY_SUCCESS_MESSAGES"))
      .replace(/{{user}}/g, msg.member.displayName)
      .replace(/{{amount}}/g, `¥${amount.toLocaleString()}`));
  }

  setCooldown(msg) {
    return msg.member.update({
      daily: new Date(msg.createdTimestamp + 86400000)
    });
  }
}

module.exports = Daily;
