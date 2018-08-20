const { Command, util: { codeBlock } } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class Regex extends Command {
  constructor(...args) {
    super(...args, {
      description: "Executes some regex",
      permissionLevel: 10,
      usage: "<regex:string> <input:string>",
      usageDelim: ","
    });
  }
  
  async run(msg, [regex, input]) {
    const flags = [];
    if(regex.startsWith("/")) {
      const flagArr = regex.split("/")[2];
      if(flagArr.length) {
        flags.push(...flagArr.split(""));
      }
      regex = regex.split("/")[1];
    }
    const reg = new RegExp(regex, ...flags);
    const res = reg.exec(input);
    if(!res) throw "Regex did not match anything.";
    const results = [];
    let counter = 0;
    for(const match of res) {
      results.push(`${counter++}. ${match}`);
    }
    return msg.send(`**Input**${codeBlock("", escapeMarkdown(input, true))}**Index**: \`${res.index}\`\n**Matches**${codeBlock("", results.map((x) => escapeMarkdown(x, true)).join("\n"))}${flags.length ? `\n**Flags**${codeBlock("", flags.join(", "))}` : ""}`);
  }
}

module.exports = Regex;
