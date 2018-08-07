const { Finalizer } = require("klasa");

class CommandCounter extends Finalizer {
  
  run() {
    this.client.commandsRan++;
  }  
}

module.exports = CommandCounter;