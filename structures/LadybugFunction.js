const { Piece } = require("klasa");

class LadybugFunction extends Piece {

  constructor(client, store, file, directory, options) {
    super(client, store, file, directory, options);
    this.aliases = options.aliases || [];
  }

  async run() {
    throw new Error(`${this.constructor.name} did not override run method.`);
  }
}

module.exports = LadybugFunction;
