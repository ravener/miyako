const Command = require("../../structures/Command.js");

class Enchant extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["enchantify"],
      description: "Convert your text into minecraft enchantment table language",
      usage: "enchant <text>",
      options: [
        {
          name: "text",
          type: "string",
          description: "The text to enchant",
          required: true
        }
      ]
    });
  }
  
  run(ctx, options) {
    const text = options.getString("text");

    return ctx.reply(text.toLowerCase()
      .replace(/a/gi, "ᔑ")
      .replace(/b/gi, "ʖ")
      .replace(/c/gi, "ᓵ")
      .replace(/d/gi, "↸")
      .replace(/e/gi, "ᒷ")
      .replace(/f/gi, "⎓")
      .replace(/g/gi, "⊣")
      .replace(/h/gi, "⍑")
      .replace(/i/gi, "╎")
      .replace(/j/gi, "⋮")
      .replace(/k/gi, "ꖌ")
      .replace(/l/gi, "ꖎ")
      .replace(/m/gi, "ᒲ")
      .replace(/n/gi, "リ")
      .replace(/o/gi, "𝙹")
      .replace(/p/gi, "!¡")
      .replace(/q/gi, "ᑑ")
      .replace(/r/gi, "∷")
      .replace(/s/gi, "ᓭ")
      .replace(/t/gi, "ℸ ̣")
      .replace(/u/gi, "⚍")
      .replace(/v/gi, "⍊")
      .replace(/w/gi, "∴")
      .replace(/x/gi, "·/")
      .replace(/y/gi, "||")
      .replace(/z/gi, "⨅"));
  }
}

module.exports = Enchant;
