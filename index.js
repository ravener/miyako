const { Client } = require("klasa");
const { WebhookClient } = require("discord.js");
const { defaultGuildSchema, defaultClientSchema, defaultUserSchema, defaultMemberSchema } = require("./utils/Schema.js");
const perms = require("./utils/permissionLevels.js");
const Constants = require("./utils/Constants.js");
const IdioticAPI = require("idiotic-api");
const { RawEventStore } = require("./stores");
const config = require("./config.json");
const Utils = require("./utils/utils.js");
const BananAPI = require("bananapi");
// const { AudioManager } = require("./utils/Lavalink");

Client.use(require("klasa-dashboard-hooks"));

class LadybugClient extends Client {
  constructor() {
    super({
      fetchAllMembers: false,
      disabledEvents: ["TYPING_START", "CHANNEL_PINS_UPDATE"],
      permissionLevels: perms,
      prefix: "lb.",
      regexPrefix: /^(((hey|yo),?\s*)?ladybug,?)\s*/i,
      providers: { default: "mongodb", mongodb: { url: config.mongodb } },
      commandEditing: true,
      pieceDefaults: {
        commands: { deletable: true, quotedStringSupport: true },
        rawEvents: { enabled: true },
        functions: { enabled: true }
      },
      typing: true,
      ownerID: "292690616285134850",
      readyMessage: (client) => `Successfully initialized. Logged in as ${client.user.tag} (${client.user.id}), Ready to serve ${client.users.size} users in ${client.guilds.size} guilds with ${client.channels.size} channels!`,
      prefixCaseInsensitive: true,
      preserveSettings: false,
      defaultClientSchema,
      defaultUserSchema,
      defaultGuildSchema,
      defaultMemberSchema,
      dashboardHooks: { port: 3000, apiPrefix: "/" }
    });
    this.constants = Constants;
    this.config = config;
    this.commandsRan = 0;
    this.bananapi = new BananAPI.Client({ token: this.config.bananapi });
    // const { password, host, port } = this.config.lavalink;
    /* this.lavalink = new AudioManager(this, {
      rest: { host, port: 2333, password },
      nodes: [
        { host, port, password }
      ],
      userID: this.constants.botID
    }); */
    this.idioticapi = new IdioticAPI.Client(this.config.idioticapi, { dev: true });
    this.rawEvents = new RawEventStore(this);
    this.registerStore(this.rawEvents);
    this.upvoters = new Set();
    this.webhook = new WebhookClient(...this.config.webhook);
    this.utils = new Utils(this);
  }
  
  login() {
    return super.login(this.config.token);
  }
}

new LadybugClient().login();
