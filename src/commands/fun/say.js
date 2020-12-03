const Command = require("../../structures/Command.js");

class Say extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["echo", "talk", "repeat", "saymiyako", "miyakosay"],
      description: (msg) => msg.tr("COMMAND_SAY"),
      usage: "say <message>"
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send(msg.tr("COMMAND_SAY_WHAT"));
    if(msg.deletable) await msg.delete().catch(() => null);
    return msg.send(args.join(" "), { disableMentions: "all" });
  }
}

module.exports = Say;
