const { Command, util: { exec, codeBlock } } = require("klasa");

class Exec extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["execute"],
      description: "Execute commands in the terminal, use with EXTREME CAUTION.",
      guarded: true,
      permissionLevel: 10,
      usage: "<expression:code|expression:string>",
      quotedStringSupport: false
    });
  }

  async run(msg, [input]) {
    if(input.code) input = input.code;
    const result = await exec(input, { timeout: "timeout" in msg.flags ? Number(msg.flags.timeout) : 60000 })
      .catch(error => ({ stdout: null, stderr: error }));
    if("silent" in msg.flags) return;
    const split = msg.flags.split;
    if(split) {
      return msg.channel.send(result.stderr || result.stdout, { split: true, code: "prolog" });
    }
    const output = result.stdout ? `**\`OUTPUT\`**${codeBlock("prolog", result.stdout)}` : "";
    const outerr = result.stderr ? `**\`ERROR\`**${codeBlock("prolog", result.stderr)}` : "";
    return msg.sendMessage([output, outerr].join("\n"));
  }
}

module.exports = Exec;
