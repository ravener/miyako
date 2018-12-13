const { Argument } = require("klasa");
const { utils: { validate, validChars } } = require("brawlstars");

class SupercellTag extends Argument {
  constructor(...args) {
    super(...args, { aliases: ["sctag"] });
  }

  async run(arg) {
    if(!validate(arg)) throw `Tag must be a valid tag, allowed characters: \`${validChars}\``;
    return arg;
  }
}

module.exports = SupercellTag;
