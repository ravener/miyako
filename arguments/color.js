const { Argument } = require("klasa");

class Color extends Argument {
  constructor(...args) {
    super(...args, {
      aliases: ["colour"]
    });
    this.regex = /(?:#|0x)?([0-9A-Fa-f]{6})/i;
  }

  async run(arg, possible) {
    const res = this.regex.exec(arg);
    if(!res) throw `**${possible.name}** must be a valid color hexadecimal.`;
    return { code: res[1], color: parseInt(`0x${res[1]}`) };
  }
}

module.exports = Color;
