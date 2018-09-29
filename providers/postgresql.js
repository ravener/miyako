const { SQLProvider, Type, QueryBuilder, util: { mergeDefault, isNumber } } = require("klasa");
const { Pool } = require("pg");

class PostgreSQL extends SQLProvider {

  constructor(...args) {
    super(...args);
    this.qb = new QueryBuilder({
      boolean: "BOOL",
      integer: ({ max }) => max >= 2 ** 32 ? "BIGINT" : "INTEGER",
      float: "DOUBLE PRECISION",
      uuid: "UUID",
      json: { type: "JSON", resolver: (input) => `'${JSON.stringify(input)}'::json` },
      any: { type: "JSON", resolver: (input) => `'${JSON.stringify(input)}'::json` },
      array: type => `${type}[]`,
      arrayResolver: (values, piece, resolver) => values.length ? `array[${values.map(value => resolver(value, piece)).join(", ")}]` : "'{}'",
      formatDatatype: (name, datatype, def = null) => `"${name}" ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ""}`
    });
    this.db = null;
  }

  async init() {
    const connection = mergeDefault({
      host: "localhost",
      port: 5432,
      database: "klasa",
      options: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      }
    }, this.client.options.providers.postgresql);
    this.db = new Pool(Object.assign({
      host: connection.host,
      port: connection.port,
      user: connection.user,
      password: connection.password,
      database: connection.database
    }, connection.options));

    this.db.on("error", err => this.client.emit("error", err));
    this.dbconnection = await this.db.connect();
  }

  shutdown() {
    this.dbconnection.release();
    return this.db.end();
  }

  /* Table methods */

  hasTable(table) {
    return this.runAll(`SELECT true FROM pg_tables WHERE tablename = '${table}';`)
      .then(result => result.length !== 0 && result[0].bool === true)
      .catch(() => false);
  }

  createTable(table, rows) {
    if (rows) return this.run(`CREATE TABLE ${sanitizeKeyName(table)} (${rows.map(([k, v]) => `${sanitizeKeyName(k)} ${v}`).join(", ")});`);
    const gateway = this.client.gateways[table];
    if (!gateway) throw new Error(`There is no gateway defined with the name ${table} nor an array of rows with datatypes have been given. Expected any of either.`);

    const schemaValues = [...gateway.schema.values(true)];
    return this.run(`
			CREATE TABLE ${sanitizeKeyName(table)} (
				${[`id VARCHAR(${gateway.idLength || 18}) PRIMARY KEY NOT NULL UNIQUE`, ...schemaValues.map(this.qb.parse.bind(this.qb))].join(", ")}
			)`
    );
  }

  deleteTable(table) {
    return this.run(`DROP TABLE IF EXISTS ${sanitizeKeyName(table)};`);
  }

  countRows(table) {
    return this.runOne(`SELECT COUNT(*) FROM ${sanitizeKeyName(table)};`)
      .then(result => Number(result.count));
  }

  /* Row methods */

  getAll(table, entries = []) {
    if (entries.length) {
      return this.runAll(`SELECT * FROM ${sanitizeKeyName(table)} WHERE id IN ('${entries.join("', '")}');`)
        .then(results => results.map(output => this.parseEntry(table, output)));
    }
    return this.runAll(`SELECT * FROM ${sanitizeKeyName(table)};`)
      .then(results => results.map(output => this.parseEntry(table, output)));
  }

  getKeys(table) {
    return this.runAll(`SELECT id FROM ${sanitizeKeyName(table)};`)
      .then(rows => rows.map(row => row.id));
  }

  get(table, key, value) {
    // If a key is given (id), swap it and search by id - value
    if (typeof value === "undefined") {
      value = key;
      key = "id";
    }
    return this.runOne(`SELECT * FROM ${sanitizeKeyName(table)} WHERE ${sanitizeKeyName(key)} = $1 LIMIT 1;`, [value])
      .then(output => this.parseEntry(table, output));
  }

  has(table, id) {
    return this.runOne(`SELECT id FROM ${sanitizeKeyName(table)} WHERE id = $1 LIMIT 1;`, [id])
      .then(result => Boolean(result));
  }

  getRandom(table) {
    return this.runOne(`SELECT * FROM ${sanitizeKeyName(table)} ORDER BY RANDOM() LIMIT 1;`);
  }

  getSorted(table, key, order = "DESC", limitMin, limitMax) {
    return this.runAll(`SELECT * FROM ${sanitizeKeyName(table)} ORDER BY ${sanitizeKeyName(key)} ${order} ${parseRange(limitMin, limitMax)};`);
  }

  create(table, id, data) {
    const [keys, values] = this.parseUpdateInput(data, false);

    // Push the id to the inserts.
    if (!keys.includes("id")) {
      keys.push("id");
      values.push(id);
    }
    return this.run(`
			INSERT INTO ${sanitizeKeyName(table)} (${keys.map(sanitizeKeyName).join(", ")})
			VALUES (${Array.from({ length: keys.length }, (__, i) => `$${i + 1}`).join(", ")});`, values);
  }

  update(table, id, data) {
    const [keys, values] = this.parseUpdateInput(data, false);
    return this.run(`
			UPDATE ${sanitizeKeyName(table)}
			SET ${keys.map((key, i) => `${sanitizeKeyName(key)} = $${i + 1}`)}
			WHERE id = '${id.replace(/'/, "''")}';`, values);
  }

  replace(...args) {
    return this.update(...args);
  }

  incrementValue(table, id, key, amount = 1) {
    return this.run(`UPDATE ${sanitizeKeyName(table)} SET $2 = $2 + $3 WHERE id = $1;`, [id, key, amount]);
  }

  decrementValue(table, id, key, amount = 1) {
    return this.run(`UPDATE ${sanitizeKeyName(table)} SET $2 = GREATEST(0, $2 - $3) WHERE id = $1;`, [id, key, amount]);
  }

  delete(table, id) {
    return this.run(`DELETE FROM ${sanitizeKeyName(table)} WHERE id = $1;`, [id]);
  }

  addColumn(table, piece) {
    return this.run(piece.type !== "Folder" ?
      `ALTER TABLE ${sanitizeKeyName(table)} ADD COLUMN ${this.qb.parse(piece)};` :
      `ALTER TABLE ${sanitizeKeyName(table)} ${[...piece.values(true)].map(subpiece => `ADD COLUMN ${this.qb.parse(subpiece)}`).join(", ")};`);
  }

  removeColumn(table, columns) {
    if (typeof columns === "string") return this.run(`ALTER TABLE ${sanitizeKeyName(table)} DROP COLUMN ${sanitizeKeyName(columns)};`);
    if (Array.isArray(columns)) return this.run(`ALTER TABLE ${sanitizeKeyName(table)} DROP COLUMN ${columns.map(sanitizeKeyName).join(", ")};`);
    throw new TypeError("Invalid usage of PostgreSQL#removeColumn. Expected a string or string[].");
  }

  updateColumn(table, piece) {
    const [column, datatype] = this.qb.parse(piece).split(" ");
    return this.run(`ALTER TABLE ${sanitizeKeyName(table)} ALTER COLUMN ${column} TYPE ${datatype}${piece.default ?
      `, ALTER COLUMN ${column} SET NOT NULL, ALTER COLUMN ${column} SET DEFAULT ${this.qb.parseValue(piece.default, piece)}` : ""
    };`);
  }

  getColumns(table, schema = "public") {
    return this.runAll(`
			SELECT column_name
			FROM information_schema.columns
			WHERE table_schema = $1
				AND table_name = $2;
		`, [schema, table]).then(result => result.map(row => row.column_name));
  }

  run(...sql) {
    return this.db.query(...sql)
      .then(result => result);
  }

  runAll(...sql) {
    return this.run(...sql)
      .then(result => result.rows);
  }

  runOne(...sql) {
    return this.run(...sql)
      .then(result => result.rows[0]);
  }
}

/**
 * @param {string} value The string to sanitize as a key
 * @returns {string}
 * @private
 */
function sanitizeKeyName(value) {
  if (typeof value !== "string") throw new TypeError(`[SANITIZE_NAME] Expected a string, got: ${new Type(value)}`);
  if (/`|"/.test(value)) throw new TypeError(`Invalid input (${value}).`);
  if (value.charAt(0) === "\"" && value.charAt(value.length - 1) === "\"") return value;
  return `"${value}"`;
}

/**
 * @param {number} [min] The minimum value
 * @param {number} [max] The maximum value
 * @returns {string}
 * @private
 */
function parseRange(min, max) {
  // Min value validation
  if (typeof min === "undefined") return "";
  if (!isNumber(min)) {
    throw new TypeError(`[PARSE_RANGE] 'min' parameter expects an integer or undefined, got ${min}`);
  }
  if (min < 0) {
    throw new RangeError(`[PARSE_RANGE] 'min' parameter expects to be equal or greater than zero, got ${min}`);
  }

  // Max value validation
  if (typeof max !== "undefined") {
    if (!isNumber(max)) {
      throw new TypeError(`[PARSE_RANGE] 'max' parameter expects an integer or undefined, got ${max}`);
    }
    if (max <= min) {
      throw new RangeError(`[PARSE_RANGE] 'max' parameter expects ${max} to be greater than ${min}. Got: ${max} <= ${min}`);
    }
  }

  return `LIMIT ${min}${typeof max === "number" ? `,${max}` : ""}`;
}

module.exports = PostgreSQL;
