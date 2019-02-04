const { Command, util: { codeBlock } } = require("klasa");
const { MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");
const { clean } = require("../../utils/utils.js");
const superagent = require("superagent");
const cheerio = require("cheerio");

class Translate extends Command {
  constructor(...args) {
    super(...args, {
      description: "Translate any text to any language!",
      extendedHelp: "Note that the languages should be an abbreviation, i.e french -> fr\nYou can also append --text flag in your message to send results as a text, useful for copying on mobile, etc.",
      usage: "<language:string> <message:...string>",
      usageDelim: " ",
      cooldown: 5,
      aliases: ["tr"]
    });
  }
  
  async run(message, [language, text]) {
    const $ = await superagent.get(`http://translate.google.com/m?hl=${language}&sl=auto&q=${encodeURIComponent(text)}`)
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36")
      .then((res) => cheerio.load(res.text))
      .catch(() => null);
    if(!$) throw "Something went wrong with google, please try again later.";
    const results = $("div.t0").first().text();
    const lang = $("div a.s1").next().next().first().text();
    if(msg.flags.text) return msg.send(clean(message, results));
    const embed = new MessageEmbed()
      .setTitle("Translated.")
      .setColor(0xff0000)
      .addField("Original Text", codeBlock("", escapeMarkdown(text, true)))
      .addField("Translated Text", `Language: ${lang}\n${codeBlock("", escapeMarkdown(results, true))}`);
    return message.send({ embed });
  }
}

module.exports = Translate;
