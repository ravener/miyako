const { Command, util: { exec, codeBlock } } = require("klasa");

class Update extends Command {
  constructor(...args) {
    super(...args, {
      description: "Execs git pull to update bot.",
      aliases: ["git", "pull"],
      permissionLevel: 10,
      guarded: true
    });
  }
  
  async run(message) {
    const res = await exec("git pull", { cwd: process.cwd() });
    const msg = [];
    if(res.stdout) msg.push(`**Results**${codeBlock("prolog", res.stdout)}`);
    if(res.stderr) msg.push(`**Error**${codeBlock("prolog", res.stderr)}`);
    return message.send(msg.join("\n"));
  }
}

module.exports = Update;
