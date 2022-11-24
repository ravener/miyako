const { Client, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
const { COLOR } = require("../utils/constants.js");
const Logger = require("../utils/log.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");

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

  /**
   * Embed template.
   * @param {UserResolvable} [user] - Set the embed's author if given.
   * @param {Object} [embed={}] - Embed data.
   * @returns {MessageEmbed}
   */
  embed(user, data = {}) {
    const embed = new EmbedBuilder(data).setColor(COLOR);

    if (user) {
      const name = user.tag;
      const iconURL = user.displayAvatarURL({ size: 64 });

      embed.setAuthor({ name, iconURL });
    }

    return embed;
  }

  async login() {
    await this.load();

    const { TOKEN, TOKEN_DEV } = process.env;
    return super.login(this.dev ? TOKEN_DEV : TOKEN);
  }
}

module.exports = MiyakoClient;
