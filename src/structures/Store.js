const { Collection } = require("discord.js");
const path = require("path");

class Store extends Collection {
  constructor(client, name) {
    super();

    this.client = client;
    this.name = name;
    this.dir = path.join(path.dirname(require.main.filename), "src", name);
  }

  set(piece) {
    const exists = this.get(piece.name);
    if (exists) this.delete(piece.name);
    super.set(piece.name, piece);
    return piece;
  }

  delete(key) {
    const exists = this.get(key);
    if (!exists) return false;
    return super.delete(key);
  }

  /**
   * Loads a single file.
   */
  load(file) {
    const filepath = path.join(this.dir, file);

    const Class = require(filepath);

    if(typeof Class !== "function" || typeof Class.constructor !== "function") {
      throw new TypeError(`The file at ${filepath} could not be loaded because it does not export a class.`);
    }

    const piece = this.set(new Class(this.client, this, {
      path: file,
      name: path.parse(filepath).name
    }));
    
    delete require.cache[filepath];
    return piece;
  }

  /**
   * Walks files and returns a promise that resolves with the amount of pieces loaded.
   */
  async loadFiles() {
    const files = await this.client.utils.walk(this.dir, {
      filter: (stats, file) => stats.isFile() && file.endsWith(".js")
    });

    for (const file of files.keys()) this.load(path.relative(this.dir, file));

    return this.size;
  }
}

module.exports = Store;
