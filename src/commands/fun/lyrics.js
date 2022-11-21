const Command = require("../../structures/Command.js");
const { request } = require("undici");
const cheerio = require("cheerio");

class Lyrics extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a song's lyrics.",
      usage: "lyrics <song>",
      cooldown: 5,
      options: [
        {
          name: "song",
          description: "The song to search.",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const song = options.getString("song");

    const hits = await request(`https://api.genius.com/search?q=${encodeURIComponent(song)}`, {
      headers: { "Authorization": `Bearer ${process.env.GENIUS}` }
    })
      .then(({ body }) => body.json())
      .then(body => body.response.hits);
    
    if (!hits.length) return ctx.reply("No results found with that query.");

    const url = hits[0].result.url;
    const image = hits[0].result.song_art_image_thumbnail_url;
    const title = hits[0].result.full_title;
    const lyrics = await request(url)
      .then(({ body }) => body.text())
      .then((html) => cheerio.load(html))
      .then(($) => $("div.lyrics").first().text());

    const embed = this.client.embed(ctx.author)
      .setTitle(title)
      .setDescription(lyrics.trim().substring(0, 1990))
      .setURL(url)
      .setThumbnail(image);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Lyrics;
