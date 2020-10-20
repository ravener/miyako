const Command = require("../../structures/Command.js");

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: "Set or reset the prefix for this server.",
      usage: "prefix [prefix|reset]",
      guildOnly: true,
      aliases: ["setprefix", "changeprefix"]
    });
  }
  
  async run(msg, args) {
    if(!args.length) {
      return msg.send(`The prefix for this server is \`${msg.guild.settings.prefix}\``);
    }

    if(!msg.member.permissions.has("MANAGE_GUILD"))
      return msg.send("Baka! You need the `Manage Server` permissions to change the prerix.");

    const prefix = args.join(" ");

    if(prefix === "reset") return this.reset(msg);
    if(prefix.length > 10) return msg.send("Prefix can't be longer than 10 characters.");
    if(prefix === msg.guild.settings.prefix) throw "Baka! That is already the current prefix.";

    await msg.guild.update({ prefix });
    return msg.send(`Successfully updated prefix to: \`${prefix}\``);
  }
  
  async reset(msg) {
    if(msg.guild.settings.prefix === "m!") return msg.send("The prefix is already the default.");
    await msg.guild.update({ prefix: "m!" });
    return msg.send("Reset the prefix for this server to `m!`");
  }
}

module.exports = Prefix;
