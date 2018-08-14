const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const cheerio = require("cheerio");
const { slice } = require("../../utils/utils.js");

class Lyrics extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a song's lyrics.",
      usage: "<query:string>",
      cooldown: 5
    });
  }

  async run(msg, [q]) {
    const lyrics = await superagent.get("https://api.genius.com/search")
      .query({ q })
      .set("Authorization", `Bearer ${this.client.config.genius}`)
      .then((res) => {
        if(!res.body.response.hits.length) throw "No results found with that query";
        return {
          url: res.body.response.hits[0].url,
          image: res.body.response.hits[0].song_art_image_thumbnail_url,
          title: res.body.response.hits[0].full_title
        };
      })
      .then(async(data) => {
        const res = await superagent.get(data.url).then((res) => res.text);
        const $ = cheerio.load(res.text);
        const text = $("div.lyrics").first().text();
        data.lyrics = text;
        return data;
      });
    const embed = new MessageEmbed()
      .setTitle(lyrics.title)
      .setDescription(slice(lyrics.lyrics.trim(), 1990))
      .setURL(lyrics.url)
      .setThumbnail(lyrics.image)
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Lyrics;
