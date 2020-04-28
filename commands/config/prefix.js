const Command = require("../../structures/Command.js");

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: "Set or reset the prefix for this server.",
      usage: "prefix [prefix|reset]",
      guildOnly: true,
      aliases: ["setprefix", "changeprefix"],
      userPermissions: ["MANAGE_GUILD"]
    });
  }
  
  async run(ctx, [prefix]) {
    if(!prefix) {
      if(!ctx.guild.settings) return ctx.reply("The prefix for this server is `m!`");
      return ctx.reply(`The prefix for this server is \`${ctx.guild.settings.prefix}\``);
    }

    if(prefix === "reset") return this.reset(ctx);
    if(prefix.length > 10) return ctx.reply("Prefix can't be longer than 10 characters.");
    if(prefix === (ctx.guild.settings ? ctx.guild.settings.prefix : "m!")) throw "Baka! That is already the current prefix.";

    await this.client.settings.update(ctx.guild.id, { prefix });
    return ctx.reply(`Successfully updated prefix to: \`${prefix}\``);
  }
  
  async reset(ctx) {
    if(!ctx.guild.settings || ctx.guild.settings.prefix === "m!") return ctx.reply("The prefix is already the default.");
    await this.client.settings.update(ctx.guild.id, { prefix: "m!" })
    return ctx.reply("Reset the prefix for this server to `m!`");
  }
}

module.exports = Prefix;
