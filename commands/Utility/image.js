const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const cheerio = require("cheerio");

class Image extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search an image in google images!",
      cooldown: 5,
      usage: "<query:string>",
      aliases: ["searchimage", "googleimages", "googleimg"]
    });
  }
  
  async run(msg, [query]) {
    const url = await superagent.get(`https://www.google.com/search?ie=ISO-8859-1&hl=en&source=hp&tbm=isch&gbv=1&gs_l=img&q=${encodeURIComponent(query)}&safe=${msg.channel.nsfw ? "disabled" : "active"}`)
      .set("User-Agent", "Lynx/2.8.8rel.2 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/1.0.2l")
      .then((res) => cheerio.load(res.text))
      .then(function find($) {
        const element = $("td a img").first();
        if (!element) return false;
        const src = element.attr("src");
        if (!src) return false;
        if (src.startsWith("/")) {
          $("td a img").first().remove();
          return find($);
        }
        return decodeURIComponent(src);
      })
      .catch(() => null);
    if(!url) throw "No results found or an error occured.";
    const embed = new MessageEmbed()
      .setTitle("Image results")
      .setImage(url)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Image;