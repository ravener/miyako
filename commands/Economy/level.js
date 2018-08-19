const { Command } = require("klasa");

class Level extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns your current level",
      runIn: ["text"],
      usage: "(member:level)",
      aliases: ["lvl"]
    });

    this.createCustomResolver("level", (arg, possible, msg) => {
      if(!arg) return undefined;
      return this.client.arguments.get("member").run(arg, possible, msg);
    });
  }

  async run(msg, [member = msg.member]) {
    if(member.user.bot) throw "Bots can't level up, therefore you can't view their level.";
    if(member === msg.member) {
      return msg.send(`You are level **${member.settings.level}**`);
    }
    return msg.send(`**${member.displayName}**'s level: **${member.settings.level}**`);
  }
}

module.exports = Level;
