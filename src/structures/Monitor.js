const Base = require("./Base.js");

class Monitor extends Base {
  constructor(client, store, file, options = {}) {
    super(client, store, file, options);

    this.ignoreEdits = options.ignoreEdits || false;
  }

  async _run(msg) {
    if (!this.enabled || (this.ignoreEdits && msg._edits.length)) return;
    
    try {
      await this.run(msg);
    } catch(err) {
      this.client.emit("monitorError", this, err);
    }
  }

  async run() {}
}

module.exports = Monitor;
