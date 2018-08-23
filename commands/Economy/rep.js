const { Command, Duration } = require("klasa");

class Rep extends Command {
  constructor(...args) {
    super(...args, {
      description: "Give someone a reputation point.",
      usage: "<member:member>",
      runIn: ["text"],
      aliases: ["reputation", "givereputation", "giverep"]
    });
  }

  async run(msg, [member]) {
    if(Date.now() < msg.author.settings.repcooldown) throw `You can give another reputation point in **${Duration.toNow(msg.author.settings.repcooldown)}**`;
    if(member.id === msg.author.id) throw "You can't give a reputation point to yourself.";
    if(member.user.bot) throw "You can't give a reputation point to bots";
    await this.setCooldown(msg);
    await member.user.settings.update("reps", member.user.settings.reps + 1);
    return msg.send(`You have given **${member.displayName}** a reputation point!`);
  }

  setCooldown(msg) {
    return msg.author.settings.update("repcooldown", msg.createdTimestamp + 86400000);
  }
}

module.exports = Rep;
