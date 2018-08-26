const { Command } = require("klasa");

class Copy extends Command {
  constructor(...args) {
    super(...args, {
      description: "Copies an emoji by id or url",
      aliases: ["copyemoji", "addemoji", "emoji"],
      cooldown: 5,
      usage: "<link:url|id:string> <name:string>",
      runIn: ["text"],
      usageDelim: " ",
      permissionLevel: 6,
      requiredPermissions: ["MANAGE_EMOJIS"]
    });
  }
  
  async run(msg, [emoji, name]) {
    if(emoji.includes("http")) return this.create(msg, emoji, name);
    const e = this.client.emojis.get(emoji);
    if(e) return this.create(msg, e.url, name, "Something went wrong.");
    const url = `https://cdn.discordapp.com/emojis/${emoji}.png`;
    return this.create(msg, url, name, "Couldn't create emoji, make sure the ID is valid.");
  }
  
  async create(msg, url, name, err = "Something went wrong, make sure the URL is valid and returns an image.") {
    const emoji = await msg.guild.emojis.create(url, name).catch(() => {
      throw err;
    });
    return msg.send(`Done! created new emoji ${emoji.name} ${emoji.toString()}`);
  }
}

module.exports = Copy;
