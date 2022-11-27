const Command = require("../../structures/Command.js");
const { inspect } = require("util");
const { getCodeBlock } = require("../../utils/utils.js");
const { request } = require("undici");

// These are only to be available in scope of eval for easier access.
/* eslint-disable no-unused-vars */
const utils = require("../../utils/utils.js");
const constants = require("../../utils/constants");
const responses = require("../../utils/responses");
// const schema = require("@utils/schema");
/* eslint-disable no-unused-vars */

class Eval extends Command {
  constructor(...args) {
    super(...args, {
      description: "Evaluates arbitrary JavaScript",
      ownerOnly: true,
      usage: "eval <code>",
      aliases: ["ev"],
      modes: ["text"]
    });
  }

  async run(ctx) {
    if (!ctx.args.length) {
      return ctx.reply("Baka! You need to give me code to evaluate.");
    }

    const { clean, client } = this;
    const { code } = getCodeBlock(ctx.rawArgs);
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");

    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) &&
        typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      if (ctx.flags.hidden) return;
      const depth = !isNaN(ctx.flags.depth) ? ctx.flags.depth : 0;
      output = inspect(output, { depth, maxArrayLength: null });
      output = output.replace(filter, "[TOKEN]");
      output = clean(output);
      if (output.length < 1950) {
        return ctx.reply(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        try {
          const { key } = await request("https://hastebin.com/documents", {
            method: "POST",
            body: output
          }).then(({ body }) => body.json());

          return ctx.reply(`Output was too long so it was uploaded to hastebin https://hastebin.com/${key}.js `);
        } catch (error) {
          return ctx.reply(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      return ctx.reply(`Error: \`\`\`js\n${error}\`\`\``);
    }
  }

  clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
}

module.exports = Eval;
