const Command = require("../../structures/Command.js");

class Copy extends Command {
  constructor(...args) {
    super(...args, {
      description: "Copies an emoji by id or url",
      aliases: ["copyemoji", "addemoji", "emoji"],
      cooldown: 5,
      usage: "<link|id> <name:string>",
      guildOnly: true,
      botPermissions: ["MANAGE_EMOJIS"],
      userPermissions: ["MANAGE_EMOJIS"]
    });
  }
  
  async run(ctx, [emoji, name]) {
    if(!emoji || !name) return ctx.reply(`Usage: \`${ctx.guild.prefix}copy <url to image or emoji id> <name to save as>\``);
    if(emoji.includes("http")) return this.create(ctx, emoji, name);
    const e = this.client.emojis.cache.get(emoji);
    if(e) return this.create(ctx, e.url, name, "Something went wrong.");
    const url = `https://cdn.discordapp.com/emojis/${emoji}.png`;
    return this.create(ctx, url, name, "Couldn't create emoji, make sure the ID is valid.");
  }
  
  async create(ctx, url, name, err = "Something went wrong, make sure the URL is valid and returns an image.") {
    const emoji = await ctx.guild.emojis.create(url, name).catch(() => {
      throw err;
    });

    return ctx.reply(`Done! created new emoji ${emoji.name} ${emoji.toString()}`);
  }
}

module.exports = Copy;
