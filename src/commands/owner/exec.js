const Command = require("../../structures/Command.js");
const exec = require("util").promisify(require("child_process").exec);

class Exec extends Command {
  constructor(...args) {
    super(...args, {
      description: "Executes commands on the shell.",
      ownerOnly: true,
      modes: ["text"]
    });
  }

  async run(ctx) {
    const result = await exec(ctx.args.join(" "), { timeout: 60000 })
      .catch(error => ({ stdout: null, stderr: error }));

    const output = result.stdout ? `**\`OUTPUT\`**${"```prolog\n" + result.stdout + "```"}` : "";
    const outerr = result.stderr ? `**\`ERROR\`**${"```prolog\n" + result.stderr + "```"}` : "";

    if (output === "" && outerr === "") {
      return ctx.reply("No output returned.");
    }

    return ctx.reply([output, outerr].join("\n"));
  }
}

module.exports = Exec;
