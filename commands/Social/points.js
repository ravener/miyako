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
    if(member.user.bot) throw "Bots can't earn points, so therefore you can't view there balance.";
    const { currency } = this.client.constants;
    if(member === msg.member) {
      return msg.send(`You have **${member.settings.points.toLocaleString()}** ${currency}`);
    }
    return msg.send(`**${member.displayName}**'s balance: **${member.settings.points.toLocaleString()}** ${currency}`);
  }
}

module.exports = Points;
