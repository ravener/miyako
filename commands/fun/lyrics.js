const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

class Lyrics extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a song's lyrics.",
      usage: "lyrics <song>",
      cooldown: 5
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What song are you looking for?");

    const hits = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(args.join(" "))}`, {
      headers: { "Authorization": `Bearer ${this.client.config.genius}` }
    })
      .then((res) => res.json())
      .then((body) => body.response.hits);
    
    if(!hits.length) return ctx.reply("No results found with that query.");

    const url = hits[0].result.url;
    const image = hits[0].result.song_art_image_thumbnail_url;
    const title = hits[0].result.full_title;
    const lyrics = await fetch(url)
      .then((res) => res.text())
      .then((html) => cheerio.load(html))
      .then(($) => $("div.lyrics").first().text());

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(lyrics.trim().substring(0, 1990))
      .setURL(url)
      .setThumbnail(image)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE);

    return ctx.reply({ embed });
  }
}

module.exports = Lyrics;
