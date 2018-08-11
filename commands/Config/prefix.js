const { Command } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: "Set or reset the prefix for this server.",
      usage: "<reset|prefix:string>",
      runIn: ["text"],
      aliases: ["setprefix", "changeprefix"],
      permissionLevel: 6
    });
  }
  
  async run(msg, [prefix]) {
    if(prefix === "reset") return this.reset(msg);
    if(prefix.length > 10) throw "Prefix should not be longer than 10 characters.";
    if(prefix === msg.guild.settings.prefix) throw "That is already the current prefix!";
    await msg.guild.settings.update("prefix", prefix);
    return msg.send(`Successfully updated prefix to: \`${escapeMarkdown(prefix, true)}\``);
  }
  
  async reset(msg) {
    await msg.guild.settings.update("prefix", this.client.options.prefix);
    return msg.send(`Reset the prefix for this server to \`${this.client.options.prefix}\``);
  }
}

module.exports = Prefix;