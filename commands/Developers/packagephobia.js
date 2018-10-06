const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

class PackagePhobia extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get install size of any npm package",
      usage: "<package:string>",
      cooldown: 3,
      aliases: ["npmsize", "npmpkgsize", "npmpackagesize", "npminstallsize"]
    });
  }

  async run(msg, [pkg]) {
    const $ = await ladybug("https://packagephobia.now.sh/result")
      .query({ p: pkg })
      .then((r) => cheerio.load(r.text));
    const html = $("div.bar-graph__bar.color1 ").last().parent().html();
    if(!html) throw "An Error occured or the package does not exist.";
    const match = html.match(/title="(.+?)">/);
    if(!match) throw "Couldn't find install size";
    const [version, publish, install] = match[1].split("|");
    const embed = new MessageEmbed()
      .setTitle(pkg)
      .setColor(0xff0000)
      .setDescription([
        `• Version: ${version.trim()}`,
        `• ${publish.trim()}`,
        `• ${install.trim()}`
      ].join("\n"))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setFooter("Powered by https://packagephobia.now.sh");
    return msg.send({ embed });
  }
}

module.exports = PackagePhobia;
