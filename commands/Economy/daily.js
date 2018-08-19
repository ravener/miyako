const { Command, Duration } = require("klasa");

class Daily extends Command {
  constructor(...args) {
    super(...args, {
      description: "Claims your daily points.",
      runIn: ["text"]
    });
  }

  async run(msg) {
    if(Date.now() < msg.member.settings.daily) throw `You can claim your daily in **${Duration.fromNow(msg.member.settings.daily)}**`;
    await msg.member.settings.update("daily", msg.createdTimestamp + 86400000);
    await msg.member.givePoints(500);
    return msg.send("You've collected your daily **$500**! Come back tomorrow for more.");
  }
}

module.exports = Daily;
