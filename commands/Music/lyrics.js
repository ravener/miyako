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
    /* if(!q && msg.guild) {
      const player = this.client.lavalink.get(msg.guild.id);
      if(!player) throw "Enter the song name to search.";
      if(!player.queue.length) throw "Nothing is in queue to bring lyrics for, so you must enter the song name!";
      q = player.queue[0].title;
    }
    if(!q) throw "Enter the song name to search."; // for DMs
    */
    const lyrics = await superagent.get("https://api.genius.com/search")
      .query({ q })
      .set("Authorization", `Bearer ${this.client.config.genius}`)
      .then((res) => {
        if(!res.body.response.hits.length) throw "No results found with that query";
        return {
          url: res.body.response.hits[0].result.url,
          image: res.body.response.hits[0].result.song_art_image_thumbnail_url,
          title: res.body.response.hits[0].result.full_title
        };
      })
      .then(async(data) => {
        const res = await superagent.get(data.url).then((res) => res.text);
        const $ = cheerio.load(res);
        const text = $("div.lyrics").first().text();
        data.lyrics = text;
        return data;
      });
    const embed = new MessageEmbed()
      .setTitle(lyrics.title)
      .setDescription(slice(lyrics.lyrics.trim(), 1990))
      .setURL(lyrics.url)
      .setThumbnail(lyrics.image)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Lyrics;
