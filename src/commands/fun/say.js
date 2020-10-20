const Command = require("../../structures/Command.js");

class Say extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["echo", "talk", "repeat", "saymiyako", "miyakosay"],
      description: "I will say whatever you want me to.",
      usage: "say <message>"
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What do you want me to say?");
    if(msg.deletable) await msg.delete().catch(() => null);
    return msg.send(args.join(" "), { disableMentions: "all" });
  }
}

module.exports = Say;
