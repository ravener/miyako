const { Client, EmbedBuilder, GatewayIntentBits, Partials, OAuth2Scopes, PermissionFlagsBits } = require("discord.js");
const { COLOR } = require("../utils/constants.js");
const Logger = require("../utils/log.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const { request } = require("undici");

class MiyakoClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
      ],
      allowedMentions: { parse: ["users"] },
      partials: [Partials.Channel]
    });

    this.dev = !!process.env.DEV;
    this.log = new Logger(this.dev ? "trace" : "info");
    this.commands = new CommandStore(this);
    this.events = new EventStore(this);
    this.lastStats = null;

    this.once("ready", () => {
      this.emit("miyakoReady");
    });
  }

  async load() {
    const stores = [this.commands, this.events];

    for (const store of stores) {
      const count = await store.loadFiles();
      this.log.info(`Loaded ${count} ${store.name}`);
    }
  }

  get invite() {
    // Generate an invite URL with the minimum permissions.
    // The commands will warn when more permissions are needed.
    return this.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.UseExternalEmojis
      ]
    });
  }

  embed(user, data = {}) {
    const embed = new EmbedBuilder(data).setColor(COLOR);

    if (user) {
      const name = user.tag;
      const iconURL = user.displayAvatarURL({ size: 64 });

      embed.setAuthor({ name, iconURL });
    }

    return embed;
  }

  postStats() {
    const server_count = this.guilds.cache.size;
    if (server_count === this.lastStats) return;

    return request(`https://top.gg/api/bots/${this.user.id}/stats`, {
      method: "POST",
      body: JSON.stringify({ server_count }),
      headers: {
        Authorization: process.env.DBL,
        "Content-Type": "application/json"
      }
    })
      .then(({ statusCode }) => {
        if (statusCode !== 200) {
          this.log.warn(`DBL returned status code ${statusCode}`);
        } else {
          this.log.info(`Posted DBL stats with server_count = ${server_count}`);
          this.lastStats = server_count;
        }
      })
      .catch(err => this.log.error(`Error posting DBL stats: ${err}`));
  }

  checkVote(user) {
    const userId = user.id ?? user;

    return request(`https://top.gg/api/bots/${this.user.id}/check`, {
      query: { userId },
      headers: { Authorization: process.env.DBL }
    })
      .then(({ body }) => body.json())
      .then(({ voted }) => Boolean(voted));
  }

  async login() {
    await this.load();

    const { TOKEN, TOKEN_DEV } = process.env;
    return super.login(this.dev ? TOKEN_DEV : TOKEN);
  }
}

module.exports = MiyakoClient;
