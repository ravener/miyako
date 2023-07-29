import { join, dirname, parse, relative } from 'node:path';
import { walk } from '../utils/utils.js';

class Store extends Map {
  constructor(client, name) {
    super();

    this.client = client;
    this.name = name;
    this.dir = join(client.base, name);
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
  async load(file, reload = false) {
    const filepath = join(this.dir, file);
    const module = await import(filepath + (reload ? `?t=${Date.now()}` : ''));

    if (typeof module.default !== 'function' || typeof module.default.constructor !== 'function') {
      throw new TypeError(`The file at '${filepath}' could not be loaded because it does not export a class.`);
    }

    const item = this.set(new module.default(this.client, this, {
      path: file,
      name: parse(filepath).name,
      dir: dirname(filepath)
    }));

    return item;
  }

  /**
   * Loads all files for this store type.
   * @returns {Number} How many items were loaded.
   */
  async loadFiles(reload = false) {
    const filter = (stats, file) => stats.isFile() && file.endsWith('.js');
    const files = await walk(this.dir, { filter });

    for (const file of files.keys()) {
      await this.load(relative(this.dir, file), reload);
    }

    return this.size;
  }
}

export default Store;
