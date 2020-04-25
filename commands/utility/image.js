const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

class Image extends Command {
  constructor(...args) {
    super(...args, {
      description: "Searches for images from Bing.",
      usage: "image <query>",
      aliases: ["imagesearch", "img", "imgsearch"],
      cooldown: 5,
      extendedHelp: "Use --index=<n> to retrieve nth image, by default it picks a random one everytime."
    });

    this.url = (query, nsfw) => `https://www.bing.com/images/search?q=${query}&view=detailv2&safeSearch=${nsfw ? "off" : "strict"}`;
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What am I supposed to search?");
    const query = args.join(" ");

    // Quick validation before we go straight to requesting.
    if(ctx.flags.index && isNaN(parseInt(ctx.flags.index)))
      return ctx.reply("--index Provided but not a number.");

    const $ = await fetch(this.url(query, ctx.channel.nsfw))
      .then((res) => {
        if(!res.ok) throw "Something went wrong with Bing.";
        return res.text();
      })
      .then((html) => cheerio.load(html));

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

    if(!results.length) return ctx.reply("No Results Found.");
    const index = ctx.flags.index ? parseInt(ctx.flags.index) : undefined;

    if(index && index > results.length)
      return ctx.reply(`--index provided as \`${index}\` but there is only \`${results.length}\` results.`);

    const image = index ? results[index - 1] : this.client.utils.random(results);
    const embed = new MessageEmbed()
      .setTitle(`Image Results: ${query}`)
      .setImage(image.url)
      .setFooter(`Size: ${image.size}, Resolution: ${image.width}x${image.height}, Format: ${image.format}`)
      .setColor(0x9590EE);

    return ctx.reply({ embed });
  }
}

module.exports = Image;
