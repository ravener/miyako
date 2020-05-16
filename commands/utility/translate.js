const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

class Translate extends Command {
  constructor(...args) {
    super(...args, {
      description: "Translate any text to any language!",
      extendedHelp: "Note that the languages should be an abbreviation, i.e french -> fr",
      usage: "translate <to> <message>",
      cooldown: 5,
      aliases: ["tr"]
    });
  }
  
  async run(ctx, [language, ...text]) {
    if(!language) return ctx.reply("Baka! What language am I supposed to translate to?");
    if(language.length !== 2) return ctx.reply("Language must be the 2 letter alias. E.g `French` -> `fr`");
    if(!text.length) return ctx.reply("Baka! What am I supposed to translate?");

    const $ = await fetch(`http://translate.google.com/m?hl=${language}&sl=auto&q=${encodeURIComponent(text.join(" "))}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36" }
    })
      .then((res) => res.text())
      .then((html) => cheerio.load(html));

    const results = $("div.t0").first().text();
    const lang = $("div a.s1").next().next().first().text();

    const embed = new MessageEmbed()
      .setTitle("Translated.")
      .setColor(0x9590EE)
      .addField("Original Text", "```\n" + text.join(" ") + "```")
      .addField("Translated Text", `Language: ${lang}\n` + "```\n" + results + "```");

    return ctx.reply({ embed });
  }
}

module.exports = Translate;
