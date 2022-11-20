
class Base {
  constructor(client, store, file, options = {}) {
    this.client = client;
    this.store = store;
    this.file = file;
    this.name = options.name ?? file.name;
    this.enabled = options.enabled ?? true;
  }

  reload() {
    return this.store.load(this.file.path);
  }
  
  enable() {
    this.enabled = true;
    return this;
  }

  disable() {
    this.enabled = false;
    return this;
  }
}

module.exports = Base;
