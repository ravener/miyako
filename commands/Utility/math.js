const { Command, util: { codeBlock } } = require("klasa");
const math = require("mathjs");
const mathEval = math.eval;

math.import({
  import: () => "Function import is disabled",
  createUnit: () => "Function createUnit is disabled",
  eval: () => "Function eval is disabled",
  parse: () => "Function parse is disabled",
  simplify: () => "Function simplify is disabled",
  derivative: () => "Function derivative is disabled"
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
    try {
      const res = mathEval(expr);
      return msg.send(`**Expression**${codeBlock("", expr)}\n**Results**${codeBlock("", res)}`);
    } catch(err) {
      return msg.send(codeBlock("", err.message || err));
    }
  }
}

module.exports = MathCommand;
