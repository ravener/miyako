
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
  constructor(client, table) {
    this.client = client;

    // Maps ID -> Value.
    // Assumes the table uses a standard 'id' column, which for our bot it does.
    this.cache = new Map();
    this.table = table;
  }

  /**
   * Get a guild by ID from cache.
   */
  get(id) {
    return this.cache.get(id);
  }

  /**
   * Updates settings for the table this settings instance manages.
   * Example:
   * update(id, { levelup: false, social: true })
   * Internally maps to an SQL query of the form:
   * INSERT INTO Settings#table (id, ...Object.keys) VALUES (...Object.values) ON CONFLICT (id) DO UPDATE SET ...;
   * Which is safe for upserts, Tries to insert and if already exists then updates it.
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
    return this.cache.set(id, rows[0]);
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
