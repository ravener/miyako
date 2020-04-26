const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");

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
  loadFiles() {
    return new Promise((resolve, reject) => {
      klaw(this.dir)
        .on("data", (item) => {
          if(!item.path.endsWith(".js")) return;
          try {
            this.load(path.relative(this.dir, item.path));
          } catch(err) {
            return reject(err);
          }
        })
        .on("error", (err) => reject(err))
        .on("end", () => resolve(this.size));
    });
  }
}

module.exports = Store;
