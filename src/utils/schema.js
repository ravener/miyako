
// Default values for database settings.
module.exports = {
  guilds: {
    weebGreetings: false,
    prefix: "m!",
    levelup: true,
    social: true,
    starboard: { channel: null, limit: 2 }
  },

  users: {
    reputation: 0,
    repscooldown: 0,
    title: null,
    prefix: null
  },

  members: {
    daily: null,
    level: 0,
    points: 0
  },

  store: {
    price: 0
  }
};
