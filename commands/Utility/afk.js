const { Command } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class AFK extends Command {
  constructor(...args) {
    super(...args, {
      description: "Sets your afk status",
      cooldown: 5,
      usage: "<reset|message:string>"
    });
  }
  
  async run(msg, [status]) {
    if(status === "reset") {
      if(!msg.author.settings.afk.status) throw "You are not afk.";
      await msg.author.settings.update([ ["afk.status", false] ["afk.message", null] ]);
      return msg.send("Done, you are no longer afk now.");
    }
    await msg.author.settings.update([ ["afk.status", true], ["afk.message", status] ]);
    return msg.send(`Done, you are now afk with message \`${escapeMarkdown(status, true)}\``);
  }
}

module.exports = AFK;
