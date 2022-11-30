const Command = require("../../structures/Command.js");
const { request } = require("undici");
const { getCodeBlock } = require("../../utils/utils.js");

class Hastebin extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["hb"],
      description: "Upload some code to hastebin.",
      usage: "hastebin <code>",
      cooldown: 5,
      modes: ["text"]
    });
  }

  async run(ctx) {
    if (!ctx.args.length) {
      return ctx.reply("Baka! What am I supposed to upload?");
    }

    const { code, lang } = getCodeBlock(ctx.rawArgs);
    const { key } = await request("https://hastebin.com/documents", {
      method: "POST",
      body: code
    })
      .then(({ body, statusCode }) => {
        if (statusCode !== 200) {
          throw `Something went wrong with Hastebin. Try again later. (Status: ${statusCode})`;
        }

        return body.json();
      });

    const url = `https://hastebin.com/${key}${lang || ""}`;
    return ctx.reply(`Hastebin-ified: ${url}`);
  }
}

module.exports = Hastebin;
