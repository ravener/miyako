const { Command, util: { codeBlock } } = require("klasa");
const math = require("mathjs");
const mathEval = math.eval;

math.import({
  import: () => { throw "Function import is disabled"; },
  createUnit: () => { throw "Function createUnit is disabled"; },
  eval: () => { throw "Function eval is disabled"; },
  parse: () => { throw "Function parse is disabled"; },
  simplify: () => { throw "Function simplify is disabled"; },
  derivative: () => { throw "Function derivative is disabled"; }
}, { override: true });

class MathCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Evalutes complex math expressions.",
      usage: "<expression:string>",
      aliases: ["calc", "calculator"]
    });
  }

  async run(msg, [expr]) {
    const res = mathEval(expr);
    return msg.send(`**Expression**${codeBlock("", expr)}\n**Results**${codeBlock("", res)}`);
  }
}

module.exports = MathCommand;
