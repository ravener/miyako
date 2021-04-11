const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class Coliru extends Command {
  constructor(...args) {
    super(...args, {
      description: "Compiles code through coliru API",
      cooldown: 5,
      usage: "<code>"
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
    for (const [x, y] of [ ["c++", "cpp"], ["rb", "ruby"], ["py", "python"], ["hs", "haskell"], ["sh", "shell"] ]) {
      this.commands[x] = this.commands[y];
    }
  }
  
  async run(msg) {
    const { lang, code } = this.client.utils.getCodeBlock(msg.rawArgs);

    if (!lang) {
      throw "Usage: coliru \\`\\`\\`lang\nCode\n\\`\\`\\`\nCodeBlock language will be used to determine how to compile the code.";
    }

    if (!this.commands[lang]) {
      throw `Invalid Language, supported ones are: **${Object.keys(this.commands).join(", ")}**`;
    }

    const cmd = this.commands[lang];
    const src = code;
    const res = await fetch("http://coliru.stacked-crooked.com/compile", {
      method: "POST",
      body: JSON.stringify({ cmd, src })
    })
      .then((res) => res.text());

    if (res.length < 1990) return msg.send(res, { code: lang });
    return this.post(msg, { cmd, src });
  }
  
  async post(msg, { cmd, src }) {
    const id = await fetch("http://coliru.stacked-crooked.com/share", {
      method: "POST",
      body: JSON.stringify({ cmd, src })
    })
      .then((res) => res.text());

    return msg.send(`Output too long. View the results here: https://coliru.stacked-crooked.com/a/${id}`);
  }  
}

module.exports = Coliru;
