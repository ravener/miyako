const { Client } = require("discord.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const MemorySweeper = require("../utils/cleanup.js");
const { Pool } = require("pg");

class MiyakoClient extends Client {
  constructor() {
    super({
      fetchAllMembers: false,
      disableMentions: "everyone",
      messageCacheMaxSize: 100,
      messageCacheLifetime: 240,
      messageSweepInterval: 300
    });
    
    this.config = require("../config.json");
    this.console = console; // TODO: Implement a console logger.
    this.constants = require("../utils/constants.js");
    this.commands = new CommandStore(this);
    this.utils = require("../utils/Utils.js"); // Easier to access everywhere.
    this.events = new EventStore(this);
    this.sweeper = new MemorySweeper(this);
    this.on("ready", this.onReady.bind(this));

    const { user, password, database } = this.config.postgresql;
    this.db = new Pool({ user, password, database });
    this.dbconn = null;
  }

  onReady() {
    this.ready = true;
    this.console.log(`Logged in as ${this.user.tag}`);
    this.emit("miyakoReady");
  }

  async login() {
    await this.init();
    return super.login(this.config.token);
  }
  
  async init() {
    // Load pieces.
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()]);
    this.console.log(`Loaded ${commands} commands.`);
    this.console.log(`Loaded ${events} events.`);

    // Connect database.
    this.dbconn = await this.db.connect();
    this.console.log("Connected to PostgreSQL");
    return require("../utils/schema.js")(this.db);
  }
}

module.exports = MiyakoClient;
