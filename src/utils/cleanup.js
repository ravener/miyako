const { SnowflakeUtil } = require("discord.js");

// THRESHOLD equals to 30 minutes in milliseconds:
//     - 1000 milliseconds = 1 second
//     - 60 seconds        = 1 minute
//     - 30 minutes
const THRESHOLD = 1000 * 60 * 30;

class MemorySweeper {
  constructor(client) {
    this.client = client;
    this.task = null; // The setInterval return
  }

  setup(ms = 600000 /* 10 mins */) {
    if (this.task) clearInterval(this.task);

    this.run();
    this.task = setInterval(() => this.run(), ms);
  }

  run() {
    const OLD_SNOWFLAKE = SnowflakeUtil.generate(Date.now() - THRESHOLD);
    let presences = 0, guildMembers = 0, voiceStates = 0, emojis = 0, lastMessages = 0, users = 0;
    
    // Per-Guild sweeper
    for (const guild of this.client.guilds.cache.values()) {
      if (!guild.available) continue;

      // Clear presences
      presences += guild.presences.cache.size;
      guild.presences.cache.clear();
      
      // Clear members that haven't send a message in the last 30 minutes
      const { me } = guild;
      for (const [id, member] of guild.members.cache) {
        if (member === me) continue;
        if (member.voice.channelID) continue;
        if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;

        guildMembers++;
        voiceStates++;
        guild.voiceStates.cache.delete(id);
        guild.members.cache.delete(id);

        // Clear the settings, will be synchronized when member is back.
        this.client.settings.members.cache.delete(`${guild.id}.${id}`);
      }
      
      // Clear emojis
      if (guild.id !== this.client.constants.mainGuildID) { // don't clear support guild's emojis.
        emojis += guild.emojis.cache.size;
        guild.emojis.cache.clear();
      }
    }
    
    // Per-Channel sweeper
    for (const channel of this.client.channels.cache.values()) {
      if (!channel.lastMessageID) continue;
      channel.lastMessageID = null;
      lastMessages++;
    }
    
    // Per-User sweeper
    for (const user of this.client.users.cache.values()) {
      if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) continue;
      this.client.users.cache.delete(user.id);
      this.client.settings.users.cache.delete(user.id);
      users++;
    }
    
    // Emit a log.
    console.log(`\x1b[36m[CACHE CLEANUP]\x1b[0m ${
      this.setColor(presences)} [Presence]s | ${
      this.setColor(guildMembers)} [GuildMember]s | ${
      this.setColor(voiceStates)} [VoiceState]s | ${
      this.setColor(users)} [User]s | ${
      this.setColor(emojis)} [Emoji]s | ${
      this.setColor(lastMessages)} [Last Message]s.`);

    const embed = this.client.embed()
      .setTitle("Cache Cleanup")
      .setDescription(`Cache cleanup sweeped:\n**Presences:** ${presences}\n**Guild Members:** ${guildMembers}\n**Voice States:** ${voiceStates}\n**Users:** ${users}\n**Emojis:** ${emojis}\n**Last Messages:** ${lastMessages}`)
      .setFooter(`Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB (Total: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB)`);

    return this.client.channels.cache.get("489480532389003294").send({ embed }).catch(() => null);
  }

  /**
   * Set a colour depending on the amount:
   * > 1000 : Light Red colour
   * > 100  : Light Yellow colour
   * < 100  : Green colour
   * @since 3.0.0
   * @param {number} number The number to colourise
   * @returns {string}
   */
  setColor(number) {
    const text = String(number).padStart(5, " ");
    // Light Red color
    if(number > 1000) return `\x1b[31m${text}\x1b[0m`;
    // Light Yellow color
    if(number > 100) return `\x1b[33m${text}\x1b[0m`;
    // Green color
    return `\x1b[32m${text}\x1b[0m`;
  }
}

module.exports = MemorySweeper;
