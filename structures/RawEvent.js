const { Piece } = require("klasa");

class RawEvent extends Piece {
  
  async run() {
    throw new Error(`${this.constructor.name} does not override run method`);
  }
}

module.exports = RawEvent;