const { Client, MessageEmbed } = require("discord.js");
const { MongoClient } = require("mongodb");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const MemorySweeper = require("@utils/cleanup");
const MonitorStore = require("../structures/MonitorStore.js");
const DBL = require("dblapi.js");
const DBLMock = require("../utils/DBLMock.js");
const Settings = require("./Settings.js");
const presences = require("@json/presences");
const imgapi = require("img-api");
const schema = require("@utils/schema");

class MiyakoClient extends Client {
  constructor(dev = false) {
    super({
      fetchAllMembers: false,
      disableMentions: "everyone",
      messageCacheMaxSize: 100,
      messageCacheLifetime: 240,
      messageSweepInterval: 300,
      ws: {
        intents: [
          "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES",
          "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"
        ]
      }
    });

    this.dev = dev;
    this.console = console; // TODO: Implement a console logger.
    this.constants = require("@utils/constants");
    this.commands = new CommandStore(this);
    this.utils = require("@utils/utils"); // Easier to access everywhere.
    this.events = new EventStore(this);
    this.monitors = new MonitorStore(this);
    this.sweeper = new MemorySweeper(this);
    this.responses = require("@utils/responses");

    this.img = new imgapi.Client({
      port: process.env.IMGAPI_PORT,
      host: process.env.IMGAPI_HOST
    });

    // Settings.
    this.settings = {
      guilds: new Settings(this, "guilds", schema.guilds),
      members: new Settings(this, "members", schema.members),
      users: new Settings(this, "users", schema.users),
      store: new Settings(this, "store", schema.store),
      client: new Settings(this, "client", schema.client)
    };

    this.dbl = process.env.DBL && !this.dev ? new DBL(process.env.DBL, this) : new DBLMock();
    this.once("ready", this.onReady.bind(this));

    this.dbClient = null;
    this.db = null;
  }

  onReady() {
    this.ready = true;
    this.console.log(`Logged in as ${this.user.tag}`);
    this.emit("miyakoReady");
  }

  async login() {
    await this.init();

    const { TOKEN, TOKEN_DEV } = process.env;
    return super.login(this.dev ? TOKEN_DEV : TOKEN);
  }

  rollPresence() {
    const { message, type } = this.utils.random(presences);
    const users = this.guilds.cache
      .filter(guild => guild.available)
      .reduce((sum, guild) => sum + guild.memberCount, 0);

    return this.user.setActivity(message
      .replace(/{{guilds}}/g, this.guilds.cache.size)
      .replace(/{{users}}/g, users), { type })
      .catch(() => null);
  }

  /**
   * Check if a given user is a premium user.
   * @returns {Promise<Boolean>}
   */
  async verifyPremium(user) {
    // First grab the support guild.
    const guild = this.guilds.cache.get(this.constants.mainGuildID);

    try {
      // Grab the member.
      const member = await guild.members.fetch(user);
      // See if they have the role.
      return member.roles.cache.has(this.constants.premiumRole);
    } catch(err) {
      // If an error happens, e.g member is not in the support guild then just return false.
      return false;
    }
  }

  /**
   * Embed template.
   * @param {UserResolvable} [user] - Set the embed's author if given.
   * @param {Object} [embed={}] - Embed data.
   * @returns {MessageEmbed}
   */
  embed(user, data = {}) {
    const embed = new MessageEmbed(data).setColor(0xD3176A);

    if (user) embed.setAuthor(user.tag, user.displayAvatarURL({ size: 64 }));

    return embed;
  }
  
  async init() {
    // Load pieces.
    const [commands, events, monitors] = await Promise.all([
      this.commands.loadFiles(),
      this.events.loadFiles(),
      this.monitors.loadFiles()
    ]);

    this.console.log(`Loaded ${commands} commands.`);
    this.console.log(`Loaded ${events} events.`);
    this.console.log(`Loaded ${monitors} monitors.`);

    const { MONGODB, MONGODB_DEV } = process.env;
    const url = (this.dev && MONGODB_DEV) || MONGODB;

    // Connect our database.
    this.dbClient = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    this.console.log("Connected to MongoDB");

    // Store reference to our database.
    this.db = this.dbClient.db();

    // Initialize settings.
    for (const [name, settings] of Object.entries(this.settings)) {
      await settings.init();
      this.console.log(`Loaded ${settings.cache.size} ${name}`);
    }
  }
}

module.exports = MiyakoClient;
