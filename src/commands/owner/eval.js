const Command = require("../../structures/Command.js");
const { inspect } = require("util");
const fetch = require("node-fetch");

// These are only to be available in scope of eval for easier access.
/* eslint-disable no-unused-vars */
const utils = require("@utils/utils");
const constants = require("@utils/constants");
const responses = require("@utils/responses");
const schema = require("@utils/schema");
/* eslint-disable no-unused-vars */

class Eval extends Command {
  constructor(...args) {
    super(...args, {
      description: "Evaluates arbitrary JavaScript",
      ownerOnly: true,
      usage: "<code>",
      aliases: ["ev"]
    });
  }

  async run(msg, args) {
    if (!args.length) return msg.send("Baka! You need to give me code to evaluate.");

    const { clean, client } = this;
    const { code } = this.client.utils.getCodeBlock(msg.rawArgs);
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");

    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) &&
        typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      if (msg.commandFlags.hidden) return;
      const depth = !isNaN(msg.commandFlags.depth) ? msg.commandFlags.depth : 0;
      output = inspect(output, { depth, maxArrayLength: null });
      output = output.replace(filter, msg.tr("COMMAND_EVAL_TOKEN"));
      output = clean(output);
      if (output.length < 1950) {
        msg.send(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        try {
          const { key } = await fetch("https://hastebin.com/documents", {
            method: "POST",
            body: output
          }).then((res) => res.json());
          return msg.send(`Output was to long so it was uploaded to hastebin https://hastebin.com/${key}.js `);
        } catch (error) {
          return msg.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch(error) {
      return msg.sendLocale("COMMAND_EVAL_ERROR", [error]);
    }
  }

  clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
}

module.exports = Eval;
