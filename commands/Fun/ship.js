const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { mix } = require("../../utils/utils.js");

class Ship extends Command {
  constructor(...args) {
    super(...args, {
      description: "Ship someone",
      aliases: ["love", "lovecalc", "lovecalculator"],
      usage: "<member:member|person:string> [member:member|person:string]",
      runIn: ["text"],
      usageDelim: " ",
      quotedStringSupport: true
    });
  }

  async run(msg, [one, two = msg.member.displayName]) {
    if(one.displayName) one = one.displayName;
    if(two.displayName) two = two.displayName;
    const { shipname, percent } = this.getLove(one, two);
    const embed = new MessageEmbed()
      .setTitle("Love Calculator")
      .setDescription(`**${one}** + **${two}**\n:heart: **${percent}%**`)
      .addField("Ship Name", shipname)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(0xff0000);
    return msg.send({ embed });
  }

  getLove(one, two) {
    const shipname = mix(one, two);
    const percent = Math.floor(Math.random() * 101);
    return { shipname, percent };
  }
}

module.exports = Ship;