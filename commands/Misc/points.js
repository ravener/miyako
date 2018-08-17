const { Command } = require("klasa");

class Points extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns your points/balance",
      aliases: ["balance", "bal"],
      runIn: ["text"],
      usage: "(member:balance)"
    });

    this.createCustomResolver("balance", (arg, possible, msg) => {
      if(!arg) return undefined;
      return this.client.arguments.get("member").run(arg, possible, msg);
    });
  }

  async run(msg, [member = msg.member]) {
    if(member === msg.member) {
      return msg.send(`You have **$${member.settings.points}** points.`);
    }
    return msg.send(`**${member.displayName}**'s balance: **$${member.settings.points}**`);
  }
}

module.exports = Points;
