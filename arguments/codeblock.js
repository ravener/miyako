const { Argument } = require("klasa");

class CodeBlock extends Argument {
  constructor(...args) {
    super(...args, {
      aliases: ["code"]
    });
    this.regex = /^```(\S*)\n?([^]*)\n?```$/i;
  }
  
  // eslint-disable-next-line no-unused-vars
  run(arg, possible, message) {
    if(!this.regex.test(arg)) throw `**${possible.name}** must be a valid codeblock.`;
    const match = this.regex.exec(arg);
    
    // ```text```
    if(match[1] && !match[2]) return { language: null, code: match[1] };
    return { language: match[1], code: match[2] };
  }
}

module.exports = CodeBlock;