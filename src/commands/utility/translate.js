const Command = require("../../structures/Command.js");
const { request } = require("undici");

class Translate extends Command {
  constructor(...args) {
    super(...args, {
      description: "Translate text to other languages via Google Translate",
      cooldown: 5,
      options: [
        {
          name: "language",
          description: "The target language to translate to.",
          type: "string",
          required: true
        },
        {
          name: "text",
          description: "The text to translate.",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const tl = options.getString("language");
    const q = options.getString("text");

    const { sentences, src } = await request("https://translate.google.com/translate_a/single", {
      query: { client: "at", dt: "t", dj: 1 },
      method: "POST",
      body: new URLSearchParams({ sl: "auto", tl, q }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
      .then(({ body, statusCode }) => {
        if (statusCode === 429) throw "Oh no! I have been ratelimited from the Google Translate API. Please try again in a few moments. ｡ﾟ･ (>﹏<) ･ﾟ｡";
        return body.json();
      });

    const embed = this.client.embed(ctx.author)
      .setTitle("Google Translate")
      .addFields([
        {
          name: `Original Text (${src})`,
          value: q,
          inline: true
        },
        {
          name: `Translated (${tl})`,
          value: sentences.map(({ trans }) => trans).join(" "),
          inline: true
        }
      ]);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Translate;
