const { Util: { mergeDefault } } = require("discord.js");

/**
 * Manages settings for a specific table.
 * Contains methods to update/get data and keeps a cache.
 * To make sure the cache is in sync only methods from here must be used.
 * To use: add a new settings instance for each table to manage in client.
 * this.settings = new Settings(this, "guilds");
 * And then use it's methods anywhere.
 * this.client.settings.update({ ... });
 */
class Settings {
  constructor(client, collection, defaults = {}) {
    this.client = client;

    // Maps ID -> Value.
    // Assumes the collection uses a standard 'id' column, which for our bot it does.
    this.cache = new Map();
    this.collection = collection;
    this.defaults = defaults; // Default values.
  }

  /**
   * Get a guild by ID from cache.
   * @param {String} id - The ID to lookup the cache.
   * @returns {?Object} The document from the cache if available.
   */
  get(id) {
    return this.cache.get(id);
  }

  /**
   * Return cache if available else return the default values.
   */
  getDefaults(id) {
    return this.cache.get(id) || this.defaults;
  }

  /**
   * Updates settings for the table this settings instance manages.
   * The input is safe for upserts. If the document does not exist it inserts it.
   * @example
   * update(id, { levelup: false, social: true });
   * @param {String} id - The ID of the document to update.
   * @param {Object} obj - An object with key-value changes to apply.
   * @returns {Object} The updated object from the database.
   */
  async update(id, obj) {
    // Safety Check.
    if (typeof obj !== "object") throw new Error("Expected an object.");

    const { value } = await this.client.db.collection(this.collection).findOneAndUpdate({ id }, { $set: obj }, {
      upsert: true,
      returnOriginal: false,
      projection: { _id: 0 }
    });

    this.cache.set(id, mergeDefault(this.defaults, value));
    return value;
  }

  /**
   * Syncs the cache with the database.
   * Use this incase the cache becomes outdated.
   * @param {String} id - ID of the document to sync.
   * @returns {Object} The newly fetched data from the database.
   */
  async sync(id) {
    const doc = await this.client.db.collection(this.collection).findOne({ id }, {
      projection: { _id: 0 }
    });

    if (!doc) return;

    this.cache.set(id, mergeDefault(this.defaults, doc));

    return doc;
  }

  /**
   * Deletes a document with the given ID.
   * @param {String} id - ID of the document to delete.
   */
  async delete(id) {
    await this.client.db.collection(this.collection).deleteOne({ id });
    this.cache.delete(id);
  }

  /**
   * Alias to db.collection(col).find(...)
   */
  find(...args) {
    return this.client.db.collection(this.collection).find(...args);
  }

  /**
   * Alias to db.collection(col).findOne(...)
   */
  findOne(...args) {
    return this.client.db.collection(this.collection).findOne(...args);
  }

  /**
   * Initializes this settings by loading the cache.
   * Call this before the client is logged in.
   */
  async init() {
    const docs = await this.client.db.collection(this.collection).find({}, {
      projection: { _id: 0 }
    }).toArray();

    for (const doc of docs) this.cache.set(doc.id, mergeDefault(this.defaults, doc));
  }
}

module.exports = Settings;
