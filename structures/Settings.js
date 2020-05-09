
/**
 * Manages settings for a specific table.
 * Contains methods to update/get data and keeps a cache.
 * To make sure the cache is in sync only methods from here must be used.
 * To use: add a new settings instance for each table to manage in client.
 * this.settings = new Settings(this, "guilds");
 * And then use it's methods anywhere.
 * this.client.settings.update({ ... });
 *
 * The goal is to abstract away the database used and no SQL query shall be used anywhere else.
 */
class Settings {
  constructor(client, table) {
    this.client = client;

    // Maps ID -> Value.
    // Assumes the table uses a standard 'id' column, which for our bot it does.
    this.cache = new Map();
    this.table = table;
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
    if(typeof obj !== "object") throw new Error("Expected an object.");
    // Get the keys and values.
    const keys = Object.keys(obj);
    const values = Object.values(obj);

    // Another safety check.
    if(!keys.length) throw new Error("Nothing to update.");

    // Build the query.
    const query = `INSERT INTO "${this.table}" ("id", ${
      keys.map((key) => `"${key}"`).join(", ")}) VALUES ($1, ${
      keys.map((_, i) => `$${i + 2}`).join(", ")}) ON CONFLICT ("id") DO UPDATE SET ${
      keys.map((key, i) => `"${key}" = $${i + 2}`).join(", ")} RETURNING *;`;

    // Execute the query and update the cache.
    const { rows } = await this.client.db.query(query, [id, ...values]);
    this.cache.set(id, rows[0]);
    return rows[0];
  }

  /**
   * Syncs the cache with the database.
   * Use this incase the cache becomes outdated.
   * @param {String} id - ID of the document to sync.
   * @returns {Object} The newly fetched data from the database.
   */
  async sync(id) {
    const { rows } = await this.client.db.query(`SELECT * FROM "${this.table}" WHERE id = $1`, [id]);
    if(!rows.length) return;
    this.cache.set(id, rows[0]);
    return rows[0];
  }

  /**
   * Deletes a document with the given ID.
   * @param {String} id - ID of the document to delete.
   */
  async delete(id) {
    await this.client.db.query(`DELETE FROM "${this.table}" WHERE id = $1`, [id]);
    this.cache.delete(id);
  }

  /**
   * find({ where: { guild: "id", price: { gt: 25, lt: 100 } }, sort: { price: -1 }, limit: 5 })
   */
  find(options = {}) {
    let count = 1;
    const values = [];
    const where = options.where ? ` WHERE ${Object.entries(options.where).map(([k, v]) => {
      if(typeof v !== "object") {
        values.push(v);
        return `"${k}" = $${count++}`;
      }

      if(v.like) {
        values.push(v.like);
        return `"${k}" LIKE $${count++}`;
      }

      // Both GT and LT in one object.
      if(!isNaN(v.gt) && !isNaN(v.lt)) {
        values.push(v.gt);
        values.push(v.lt);

        count += 2;
        return `"${k}" > $${count - 2} AND "${k}" < $${count - 1}`;
      } else if(!isNaN(v.gt)) {
        values.push(v.gt);
        return `"${k}" > $${count++}`;
      } else if(!isNaN(v.lt)) {
        values.push(v.lt);
        return `"${k}" < $${count++}`;
      }

    }).join(" AND ")}` : "";
    const sort = options.sort && Object.keys(options.sort).length === 1 ? ` ORDER BY "${Object.keys(options.sort)[0]}" ${
      Object.values(options.sort)[0] === 1 ? "ASC" : "DESC"}` : "";
    // Shouldn't need user input here so we didn't use $ parameters, but will modify this if ever needed.
    const limit = options.limit ? ` LIMIT ${options.limit}` : "";
    const query = `SELECT * FROM "${this.table}"${where}${sort}${limit}`;
    return this.client.db.query(query, values).then((r) => r.rows);
  }

  /**
   * Like find but returns only the first element or null.
   */
  findOne(options = {}) {
    return this.find(options).then((r) => r[0] || null);
  }

  /**
   * Initializes this settings by loading the cache.
   * Call this before the client is logged in.
   */
  async init() {
    const { rows } = await this.client.db.query(`SELECT * FROM "${this.table}"`);
    for(const row of rows) this.cache.set(row.id, row);
  }
}

module.exports = Settings;
