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
      const { rows } = await this.client.db.query("SELECT * FROM guilds WHERE id = $1", [ctx.guild.id]);
      if(!rows.length) return ctx.reply("The prefix for this server is `m!`");
      return ctx.reply(`The prefix for this server is \`${rows[0].prefix}\``);
    }

    if(prefix === "reset") return this.reset(ctx);
    if(prefix.length > 10) throw "Prefix can't be longer than 10 characters.";
    if(prefix === ctx.guildPrefix) throw "Baka! That is already the current prefix.";
    await this.client.db.query("INSERT INTO guilds (id, prefix) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET prefix = $2", [ctx.guild.id, prefix]);
    return ctx.reply(`Successfully updated prefix to: \`${prefix}\``);
  }
  
  async reset(ctx) {
    if(ctx.guildPrefix === "m!") return ctx.reply("The prefix is already the default.");
    await this.client.db.query("UPDATE guilds SET prefix = $1 WHERE id = $2", ["m!", ctx.guild.id]);
    return ctx.reply(`Reset the prefix for this server to \`m!\``);
  }
}

module.exports = Prefix;
