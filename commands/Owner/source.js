const { Command } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class Source extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns source code of any piece.",
      permissionLevel: 10,
      aliases: ["src"],
      guarded: true,
      usage: "<piece:piece>"
    });
  }
  
  async run(msg, [piece]) {
    return msg.channel.send(escapeMarkdown(piece.constructor.toString(), true), { split: true, code: "js" });
  }
}

module.exports = Source;
