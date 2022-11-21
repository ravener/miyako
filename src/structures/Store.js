const { join, dirname, parse, relative } = require("node:path");
const { walk } = require("../utils/utils.js");

class Store extends Map {
  constructor(client, name) {
    super();

    this.client = client;
    this.name = name;
    this.dir = join(dirname(require.main.filename), name);
  }

  set(item) {
    const exists = this.get(item.name);
    if (exists) this.delete(item.name);

    super.set(item.name, item);
    return item;
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
    const filepath = join(this.dir, file);
    const Class = require(filepath);

    if (typeof Class !== "function" || typeof Class.constructor !== "function") {
      throw new TypeError(`The file at ${filepath} could not be loaded because it does not export a class.`);
    }

    const item = this.set(new Class(this.client, this, {
      path: file,
      name: parse(filepath).name,
      dir: dirname(filepath)
    }));

    delete require.cache[filepath];
    return item;
  }

  /**
   * Loads all files for this store type.
   * @returns {Number} How many items were loaded.
   */
  async loadFiles() {
    const filter = (stats, file) => stats.isFile() && file.endsWith(".js");
    const files = await walk(this.dir, { filter });

    for (const file of files.keys()) {
      this.load(relative(this.dir, file));
    }

    return this.size;
  }
}

module.exports = Store;
