const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class UserPrefix extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manage Per-User Global prefixes.",
      aliases: ["uprefix"],
      usage: "userprefix <add|remove|list:default> <prefix>"
    });
  }

  async run(ctx, [action = "list", ...args]) {
    if(!["add", "remove", "list"].includes(action))
      return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``);

    return this[action](ctx, args);
  }

  async add(ctx, args) {
    if(ctx.author.settings.prefix && ctx.author.settings.prefix.length >= 10)
      return ctx.reply("Baka! You can't have more than 10 prefixes. Remove some before trying again.");
    
    const prefixInput = args.join(" ");
    if(!prefixInput) return ctx.reply("Baka! You must provide a prefix.");

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if(prefixInput.length > 15) return ctx.reply("Baka! Prefix cannot be longer than 15 characters!");

    // Get existing prefixes to append to.
    const prefix = msg.author.settings.prefix || [];

    // Avoid duplicates.
    if(prefix.includes(prefixInput)) return ctx.reply("Baka! That prefix is already on the list.");

    prefix.push(prefixInput);

    await ctx.author.update({ prefix });
    return ctx.reply(`Successfully added the prefix \`${prefixInput}\` to your list of prefixes.`);
  }

  async list(ctx) {
    if(!ctx.author.settings.prefix || !ctx.author.settings.prefix.length)
      return ctx.reply("You don't have any user prefixes yet!");

    const embed = new MessageEmbed()
      .setTitle("User Prefixes")
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE)
      .setDescription(ctx.author.settings.prefix.map((prefix) => `• ${prefix}`).join("\n"));

    return ctx.reply({ embed });
  }

  async remove(ctx, args) {
    if(!ctx.author.settings.prefix || !ctx.author.settings.prefix)
      return ctx.reply("You don't have any prefixes to remove!");

    const prefixInput = args.join(" ");
    if(!prefixInput) return ctx.reply("Baka! You must provide a prefix to remove!");

    const prefix = ctx.author.settings.prefix;
    if(!prefix.includes(prefixInput)) return ctx.reply("Baka! That prefix is not in your list.");

    prefix.slice(prefix.indexOf(prefixInput), 1);

    await ctx.author.update({ prefix });

    return ctx.reply(`Successfully removed the prefix \`${prefixInput}\` from your prefix list.`);
  }
}

module.exports = UserPrefix;
