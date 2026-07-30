import type MiyakoClient from './MiyakoClient.js';
import type Store from './Store.js';
import type { PieceLocation, BaseData } from '../types.js';

class Base {
  client: MiyakoClient;
  store: Store;
  file: PieceLocation;
  name: string;
  enabled: boolean;

  constructor(client: MiyakoClient, store: Store, file: PieceLocation, options: BaseData = {}) {
    this.client = client;
    this.store = store;
    this.file = file;
    this.name = options.name ?? file.name;
    this.enabled = options.enabled ?? true;
  }

  reload() {
    return this.store.load(this.file.path, true);
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

export default Base;
