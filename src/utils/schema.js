
// Default values for database settings.
module.exports = {
  // Per-server settings.
  guilds: {
    weebGreetings: false,
    prefix: "m!",
    levelup: true,
    social: true,
    starboard: { channel: null, limit: 2 }
  },

  // Global bot settings.
  client: {
    blacklist: [], // Blacklisted User IDs
    guildBlacklist: [], // Blacklisted Server IDs
    commands: {} // How much each command is ran. Example Format: { ping: 5, kick: 2, say: 3 }
  },

  // Per-user settings (global)
  users: {
    reputation: 0,
    repscooldown: 0,
    title: null,
    prefix: null
  },

  // Per-member settings (Per-server)
  members: {
    daily: null,
    level: 0,
    points: 0
  },

  // Guild role store. (Per-server)
  store: {
    price: 0
  }
};
