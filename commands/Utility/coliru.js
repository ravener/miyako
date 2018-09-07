const { Command, util: { codeBlock } } = require("klasa");
const { post } = require("superagent");
const { slice } = require("../../utils/utils.js");

class Coliru extends Command {
  constructor(...args) {
    super(...args, {
      description: "Compiles code through coliru API",
      cooldown: 5,
      usage: "<code:code>",
      permissionLevel: 2,
      quotedStringSupport: false
    });
    
    this.commands = {
      cpp: "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
      c: "mv main.cpp main.c && gcc main.c -pedantic -O2 -pthread -Wall -Wextra && ./a.out",
      ruby: "ruby main.cpp",
      lua: "lua main.cpp",
      python: "python main.cpp",
      haskell: "runhaskell main.cpp",
      bash: "bash main.cpp",
      shell: "sh main.cpp"
    };
    
    // Aliases.
    for(const [x, y] of [ ["c++", "cpp"], ["rb", "ruby"], ["py", "python"], ["hs", "haskell"], ["sh", "shell"] ]) {
      this.commands[x] = this.commands[y];
    }
  }
  
  async run(msg, [code]) {
    if(!code.language) throw "Couldn't find language in codeblock.";
    if(!this.commands[code.language]) throw `Invalid Language, supported ones are: **${Object.keys(this.commands).join(", ")}**`;
    const cmd = this.commands[code.language];
    const src = code.code;
    const res = await post("http://coliru.stacked-crooked.com/compile")
      .send({ cmd, src })
      .then((res) => res.text);
    if(res.length < 1950) return msg.send(codeBlock(code.language, res));
    if("split" in msg.flags) return msg.channel.send(res, { code: code.language, split: true });
    if("url" in msg.flags) return this.post(msg, { cmd, src });
    if("hastebin" in msg.flags || "haste" in msg.flags) return this.haste(msg, res, code.language);
    if("slice" in msg.flags) return msg.send(codeBlock(code.language, slice(res, 1950)));
    throw "Results too long to be sent in discord, use flags to control the output, available flags: **haste/hastebin, url, split, slice**\nTo use a flag simply append in your message --flagname";
  }
  
  async haste(msg, res, lang) {
    const url = await post("https://hastebin.com/documents")
      .send(res)
      .then((res) => `https://hastebin.com/${res.body.key}.${lang}`)
      .catch(() => null);
    if(!res) throw "Couldn't hastebin output due to an error, try again later.";
    return msg.send(`Hastebin-ified output: ${url}`);
  }
  
  async post(msg, { cmd, src }) {
    const id = await post("http://coliru.stacked-crooked.com/share")
      .send({ cmd, src })
      .then((res) => res.text)
      .catch(() => null);
    if(!id) throw "Couldn't send output URL, due to an error, try again later.";
    return msg.send(`View the result here: http://coliru.stacked-crooked.com/a/${id}`);
  }  
}

module.exports = Coliru;
