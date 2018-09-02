const { Client } = require("klasa");
const { defaultGuildSchema, defaultClientSchema, defaultUserSchema, defaultMemberSchema } = require("./utils/Schema.js");
const perms = require("./utils/permissionLevels.js");
const Constants = require("./utils/Constants.js");
const IdioticAPI = require("idiotic-api");
const RawEventStore = require("./stores/RawEventStore.js");
const config = require("./config.json");
const { AudioManager } = require("./utils/Lavalink");

class LadybugClient extends Client {
  constructor() {
    super({
      fetchAllMembers: false,
      disabledEvents: ["TYPING_START"],
      permissionLevels: perms,
      prefix: "lb.",
      regexPrefix: /^((hey\s*)?ladybug,?)\s*/i,
      providers: { default: "postgresql", mongodb: { url: config.mongodb, db: "ladybug", options: { useNewUrlParser: true } }, postgresql: config.postgresql },
      commandEditing: true,
      pieceDefaults: {
        commands: { deletable: true },
        rawEvents: { enabled: true }
      },
      typing: true,
      ownerID: "292690616285134850",
      readyMessage: (client) => `Successfully initialized. Logged in as ${client.user.tag} (${client.user.id}), Ready to serve ${client.users.size} users in ${client.guilds.size} guilds with ${client.channels.size} channels!`,
      prefixCaseInsensitive: true,
      preserveSettings: false,
      defaultClientSchema,
      defaultUserSchema,
      defaultGuildSchema,
      defaultMemberSchema
    });
    this.constants = Constants;
    this.config = config;
    this.commandsRan = 0;
    this.lavalink = new AudioManager(this, {
      rest: { host: "localhost", port: 2333, password: this.config.lavalink },
      nodes: [
        { host: "localhost", port: 3000, password: this.config.lavalink }
      ],
      userID: this.constants.botID
    });
    this.idioticapi = new IdioticAPI.Client(this.config.idioticapi, { dev: true });
    this.rawEvents = new RawEventStore(this);
    this.registerStore(this.rawEvents);
  }
  
  login() {
    return super.login(this.config.token);
  }
}

const client = new LadybugClient();
client.login();
