const Command = require("../../structures/Command.js");
const { inspect } = require("util");
const fetch = require("node-fetch");

class Eval extends Command {
  constructor(...args) {
    super(...args, {
      description: "Evaluates arbitrary JavaScript",
      ownerOnly: true,
      usage: "<code>",
      aliases: ["ev"]
    });
  }

  async run(ctx, args) {
    const { clean, client } = this;
    const code = args.join(" ");
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, "[TOKEN]");
      output = clean(output);
      if (output.length < 1950) {
        ctx.reply(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        try {
          const { key } = await fetch("https://hastebin.com/documents", {
            method: "POST",
            body: output
          }).then((res) => res.json());
          return ctx.reply(`Output was to long so it was uploaded to hastebin https://hastebin.com/${key}.js `);
        } catch (error) {
          return ctx.reply(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      return ctx.reply(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    }
  }

  clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
}

module.exports = Eval;
