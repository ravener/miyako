const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const ZWS = "\u200B";

class Urban extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ud", "urbandictionary"],
      botPermissions: ["EMBED_LINKS"],
      description: "Searches the Urban Dictionary library for a definition to the search term.",
      usage: "urban <query>, [page]",
      cooldown: 3
    });
	}
  
  async run(ctx, args) {
    const [query, ind = 1] = args.join(" ").split(", ");
    if(isNaN(parseInt(ind))) return ctx.reply("Baka! Page must be a number.");
    const index = ind - 1;
    if(index < 0) return ctx.reply("The number cannot be zero or negative.");
    
    const { list } = await fetch(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`)
      .then((res) => res.json());
    
    const result = list[index];

    if(typeof result === "undefined")
      return ctx.reply(index === 0 ? "I could not find this entry in Urban Dictionary" :
        "I could not find this page in Urban Dictionary, try a lower page index");
    
    const definition = this.content(result.definition, result.permalink);
    return ctx.reply(new MessageEmbed()
			.setTitle(`Word: ${this.client.utils.toProperCase(query)}`)
      .setURL(result.permalink)
      .setColor(0x9590EE)
      .setThumbnail("http://i.imgur.com/CcIZZsa.png")
      .setDescription([
        `→ \`Definition\` :: ${ind}/${list.length}\n${definition}`,
        `→ \`Example\` :: ${this.cutText(result.example, 750)}`,
        `→ \`Author\` :: ${result.author}`
      ])
      .addField(ZWS, `\\👍 ${result.thumbs_up}`, true)
      .addField(ZWS, `\\👎 ${result.thumbs_down}`, true)
      .setFooter("© Urban Dictionary"));
	}
  
  content(definition, permalink) {
    const format = this.format(definition);
    if(format.length < 750) return format;
    if(definition.length < 750) return definition;
    return `${this.cutText(definition, 750)}... [continue reading](${permalink})`;
  }
  
  cutText(str, length) {
    if(str.length < length) return str;
    const cut = this.splitText(str, length - 3);
    if(cut.length < length - 3) return `${cut}...`;
    return `${cut.slice(0, length - 3)}...`;
  }
  
  splitText(str, length, char = " ") {
    const x = str.substring(0, length).lastIndexOf(char);
    const pos = x === -1 ? length : x;
    return str.substring(0, pos);
  }

  format(str) {
    // https://stackoverflow.com/questions/52374809/javascript-regular-expression-to-catch-boxes
    return str.replace(/\[([^\][]+)\]/g, (x, y) => `${x}(https://www.urbandictionary.com/define.php?term=${y.replace(/\s+/g, "+")})`);
  }
}

module.exports = Urban;
