const { Provider, util: { mergeDefault, mergeObjects, isObject } } = require("klasa");

const { MongoClient: Mongo } = require("mongodb");

class MongoDB extends Provider {

  constructor(...args) {
    super(...args, { description: "Allows use of MongoDB functionality throughout Klasa" });
    this.db = null;
  }

  async init() {
    const connection = mergeDefault({
      url: "mongodb://localhost:27017",
      db: "klasa",
      options: {}
    }, this.client.options.providers.mongodb);
    const mongoClient = await Mongo.connect(connection.url, connection.options);
    this.db = mongoClient.db(connection.db);
  }

  /* Table methods */

  get exec() {
    return this.db;
  }

  hasTable(table) {
    return this.db.listCollections().toArray().then(collections => collections.some(col => col.name === table));
  }

  createTable(table) {
    return this.db.createCollection(table);
  }

  deleteTable(table) {
    return this.db.dropCollection(table);
  }

  /* Document methods */

  getAll(table, filter = []) {
    if (filter.length) return this.db.collection(table).find({ id: { $in: filter } }, { _id: 0 }).toArray();
    return this.db.collection(table).find({}, { _id: 0 }).toArray();
  }

  getKeys(table) {
    return this.db.collection(table).find({}, { id: 1, _id: 0 }).toArray();
  }

  get(table, id) {
    return this.db.collection(table).findOne(resolveQuery(id));
  }

  has(table, id) {
    return this.get(table, id).then(Boolean);
  }

  getRandom(table) {
    return this.db.collection(table).aggregate({ $sample: { size: 1 } });
  }

  async removeValue(table, doc) {
    // { channels: { modlog: true } }
    if (typeof doc === "object") {
      return this.db.collection(table).update({}, { $unset: doc }, { multi: true });
    }
    // 'channels.modlog'
    if (typeof doc === "string") {
      const route = doc.split(".");
      const object = {};
      let ref = object;
      for (let i = 0; i < route.length - 1; i++) ref = ref[route[i]] = {};
      ref[route[route.length - 1]] = true;
      return this.db.table(table).update({}, { $unset: object }, { multi: true });
    }
    throw new TypeError(`Expected an object or a string as first parameter. Got: ${typeof doc}`);
  }

  create(table, id, doc = {}) {
    return this.db.collection(table).insertOne(mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
  }

  delete(table, id) {
    return this.db.collection(table).deleteOne(resolveQuery(id));
  }

  update(table, id, doc) {
    return this.db.collection(table).updateOne(resolveQuery(id), { $set: this.parseUpdateInput(doc) });
  }

  replace(table, id, doc) {
    return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
  }
}

const resolveQuery = query => isObject(query) ? query : { id: query };

module.exports = MongoDB;