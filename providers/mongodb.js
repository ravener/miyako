const { Provider, util: { mergeDefault, mergeObjects, isObject } } = require("klasa");

const { MongoClient: Mongo } = require("mongodb");

class MongoDB extends Provider {

  constructor(...args) {
    super(...args, { description: "Allows use of MongoDB functionality throughout Klasa" });
    this.db = null;
  }

  async init() {
    const connection = mergeDefault({
      url: "mongodb://localhost",
      db: "ladybug",
      options: {}
    }, this.client.options.providers.mongodb);
    const mongoClient = await Mongo.connect(connection.url);
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

  create(table, id, doc = {}) {
    return this.db.collection(table).insertOne(mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
  }

  delete(table, id) {
    return this.db.collection(table).deleteOne(resolveQuery(id));
  }

  update(table, id, doc) {
    return this.db.collection(table).updateOne(resolveQuery(id), { $set: parseUpdateObject(this.parseUpdateInput(doc)) });
  }

  replace(table, id, doc) {
    return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
  }

}

const resolveQuery = query => isObject(query) ? query : { id: query };

const parseUpdateObject = (doc, pref = "", oldObj = {}) => {
  const obj = oldObj;
  const prefix = pref !== "" ? `${pref}.` : "";
  for (const key in doc) {
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      if (typeof doc[key] !== "object" || Object.keys(doc[key]).length === 0) {
        obj[`${prefix}${key}`] = doc[key];
        continue;
      }
      parseUpdateObject(doc[key], `${prefix}${key}`, obj);
    }
  }
  return obj;
};

module.exports = MongoDB;
