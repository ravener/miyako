const { Command, Duration } = require("klasa");

class Daily extends Command {
  constructor(...args) {
    super(...args, {
      description: "Claims your daily points.",
      extendedHelp: "You can give/donate your daily for others and it will reward bonus for them.",
      runIn: ["text"],
      usage: "(user:daily)",
      aliases: ["dailies", "dailycredits", "dailypoints"]
    });

    this.createCustomResolver("daily", (arg, possible, msg) => {
      if(!arg) return undefined;
      return this.client.arguments.get("member").run(arg, possible, msg);
    });
  }

  async run(msg, [member]) {
    if(Date.now() < msg.member.settings.daily) throw `You can claim your daily in **${Duration.toNow(msg.member.settings.daily)}**`;
    if(member) {
      if(member.user.bot) throw "You can't give your daily points to a bot!";
      await this.setCooldown(msg);
      await member.givePoints(750);
      return msg.send(`You have given your daily to **${member.displayName}**, as a bonus they get **$750** points.`);
    }
    await this.setCooldown(msg);
    await msg.member.givePoints(500);
    return msg.send("You've collected your daily **$500**! Come back tomorrow for more.");
  }

  setCooldown(msg) {
    return msg.member.settings.update("daily", msg.createdTimestamp + 86400000);
  }
}

module.exports = Daily;
