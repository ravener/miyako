const Command = require("../../structures/Command.js");
const { request } = require("undici");
const { getCodeBlock } = require("../../utils/utils.js");

class Coliru extends Command {
  constructor(...args) {
    super(...args, {
      description: "Compiles code through coliru API",
      cooldown: 5,
      usage: "<code>",
      modes: ["text"]
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

    const aliases = [
      ["c++", "cpp"],
      ["rb", "ruby"],
      ["py", "python"],
      ["hs", "haskell"],
      ["sh", "shell"]
    ];
    
    for (const [alias, name] of aliases) {
      this.commands[alias] = this.commands[name];
    }
  }
  
  async run(ctx) {
    const { lang, code } = getCodeBlock(ctx.rawArgs);

    if (!lang) {
      throw "Usage: coliru \\`\\`\\`lang\nCode\n\\`\\`\\`\nCodeBlock language will be used to determine how to compile the code.";
    }

    if (!this.commands[lang]) {
      throw `Invalid Language, supported ones are: **${Object.keys(this.commands).join(", ")}**`;
    }

    const cmd = this.commands[lang];
    const src = code;
    const res = await request("http://coliru.stacked-crooked.com/compile", {
      method: "POST",
      body: JSON.stringify({ cmd, src })
    })
      .then(({ body }) => body.text());

    if (res.length < 1990) {
      return ctx.reply(`\`\`\`${lang}\n${res}\`\`\``);
    }

    return this.post(ctx, { cmd, src });
  }
  
  async post(ctx, { cmd, src }) {
    const id = await request("http://coliru.stacked-crooked.com/share", {
      method: "POST",
      body: JSON.stringify({ cmd, src })
    })
      .then(({ body }) => body.text());

    return ctx.reply(`Output too long. View the results here: https://coliru.stacked-crooked.com/a/${id}`);
  }  
}

module.exports = Coliru;
