const { Collection } = require("discord.js");
const path = require("path");

class Store extends Collection {
  constructor(client, name) {
    super();
    this.client = client;
    this.name = name;
    this.dir = `${path.dirname(require.main.filename)}${path.sep}${name}`;
  }

  set(piece) {
    const exists = this.get(piece.name);
    if(exists) this.delete(piece.name);
    super.set(piece.name, piece);
    return piece;
  }

  delete(key) {
    const exists = this.get(key);
    if(!exists) return false;
    return super.delete(key);
  }

  /**
   * Loads a single file.
   */
  load(file) {
    const filepath = path.join(this.dir, file);
    
    const piece = this.set(new (require(filepath))(this.client, {
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

    [...files.keys()].map((file) => this.load(path.relative(this.dir, file)));

    return this.size;
  }
}

module.exports = Store;
