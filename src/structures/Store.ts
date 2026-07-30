import { join, dirname, parse, relative } from 'node:path';
import { walk } from '../utils/utils.js';
import type { Stats } from 'node:fs';
import type MiyakoClient from './MiyakoClient.js';
import type Base from './Base.js';

class Store extends Map<string, Base> {
  client: MiyakoClient;
  name: string;
  dir: string;

  constructor(client: MiyakoClient, name: string) {
    super();

    this.client = client;
    this.name = name;
    this.dir = join(client.base, name);
  }

  // @ts-expect-error Store narrows Map#set to accept a single item keyed by its name.
  set(item: Base): Base {
    const exists = this.get(item.name);
    if (exists) this.delete(item.name);

    super.set(item.name, item);
    return item;
  }

  delete(key: string): boolean {
    const exists = this.get(key);
    if (!exists) return false;

    return super.delete(key);
  }

  /**
   * Loads a single file.
   */
  async load(file: string, reload = false): Promise<Base> {
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
  async loadFiles(reload = false): Promise<number> {
    const filter = (stats: Stats, file: string) => stats.isFile() && file.endsWith('.js');
    const files = await walk(this.dir, { filter });

    for (const file of files.keys()) {
      await this.load(relative(this.dir, file), reload);
    }

    return this.size;
  }
}

export default Store;
