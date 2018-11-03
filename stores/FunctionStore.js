const { Store } = require("klasa");
const LadybugFunction = require("../structures/LadybugFunction.js");

class FunctionStore extends Store {
  constructor(client) {
    super(client, "functions", LadybugFunction);
  }

  set(key, value) {
    super.set(key, value);
    this[key] = value.run.bind(value);
    for(const name of value.aliases) {
      Object.defineProperty(this, name, {
        get: () => {
          return this.get(value.name).run.bind(value);
        }
      });
    }
  }

  async init() {
    await super.init();
    for(const [key, value] of this.entries()) {
      // Add each piece's run as a property so it is possible to do
      // this.client.functions.name() rather than having to do .get(name).run()
      this[key] = value.run.bind(value);
      // Aliases
      for(const name of value.aliases) {
        Object.defineProperty(this, name, {
          get: () => {
            return this.get(value.name).run.bind(this);
          }
        });
      }
    }
  }
}

module.exports = FunctionStore;
