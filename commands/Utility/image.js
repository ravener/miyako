const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { random, slice } = require("../../utils/utils.js");
const ladybug = require("ladybug-fetch");
const cheerio = require("cheerio");

class Image extends Command {
  constructor(...args) {
    super(...args, {
      description: "Searches for images from Bing.",
      usage: "<query:string>",
      aliases: ["imagesearch", "img", "imgsearch"],
      cooldown: 3,
      extendedHelp: "Use --index=<n> to retrieve nth image, by default it picks a random one everytime."
    });
    this.userAgent = { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36" };
    this.url = (query, nsfw) => `https://www.bing.com/images/search?q=${query}&view=detailv2&safeSearch=${nsfw ? "off" : "strict"}`;
  }

  async run(msg, [query]) {
    // Quick validation before we go straight to requesting.
    if(msg.flags.index && isNaN(parseInt(msg.flags.index)))
      throw "--index Provided but not a number.";
    const { text, status } = await ladybug(this.url(query, msg.channel.nsfw))
      .set(this.userAgent);
    if(status !== 200) throw "Something went wrong with Bing.";
    const $ = cheerio.load(text);
    const results = [];
    $(".item a[class=\"thumb\"]").each((_, el) => {
      const details = $(el).parent().find(".fileInfo").text().split(" ");
      return results.push({
        url: $(el).attr("href"),
        width: details[0],
        height: details[2],
        format: details[3],
        size: details[4]
      });
    });
    const index = msg.flags.index ? parseInt(msg.flags.index) : undefined;
    if(index && index > results.length)
      throw `--index provided as \`${index}\` but there is only \`${results.length}\` results.`;
    const image = index ? results[index - 1] : random(results);
    const embed = new MessageEmbed()
      .setTitle(`Image Results: ${slice(query, 128)}`)
      .setImage(image.url)
      .setFooter(`Size: ${image.size}, Resolution: ${image.width}x${image.height}, Format: ${image.format}`)
      .setColor(0xFF0000);
    return msg.send({ embed });
  }
}

module.exports = Image;
