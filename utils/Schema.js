const { Client } = require("klasa");

Client.use(require("klasa-member-gateway"));

module.exports.defaultGuildSchema = Client.defaultGuildSchema
  .add("levelup", "boolean", { default: true })
  .add("welcome", (folder) => folder
    .add("channel", "channel")
    .add("message", "string")
    .add("enabled", "boolean", { default: false }))
  .add("leave", (folder) => folder
    .add("channel", "channel")
    .add("message", "string")
    .add("enabled", "boolean", { default: false }))
  .add("automod", (folder) => folder
    .add("invites", "boolean", { default: false }))
  .add("tags", "any", { array: true })
  .add("modlogs", (folder) => folder
    .add("channel", "channel")
    .add("enabled", "boolean", { default: false })
    .add("ban", "boolean", { default: false })
    .add("kick", "boolean", { default: false })
    .add("invites", "boolean", { default: false })
    .add("messages", "boolean", { default: false })
    .add("roles", "boolean", { default: false })
    .add("channels", "boolean", { default: false })
    .add("mute", "boolean", { default: false })
    .add("leave", "boolean", { default: false })
    .add("join", "boolean", { default: false })
    .add("warn", "boolean", { default: false }));

module.exports.defaultUserSchema = Client.defaultUserSchema
  .add("afk", (folder) => folder
    .add("status", "boolean")
    .add("message", "string"))
  .add("reps", "integer", { default: 0, configurable: false })
  .add("repcooldown", "integer", { default: Date.now() - 86400000, configurable: false });

module.exports.defaultClientSchema = Client.defaultClientSchema
  .add("psa", (folder) => folder
    .add("message", "string")
    .add("date", "integer"));

module.exports.defaultMemberSchema = Client.defaultMemberSchema
  .add("points", "integer", { default: 0 })
  .add("daily", "integer", { default: Date.now() - 86400000 })
  .add("level", "integer", { default: 0 })
  .add("highlight", (folder) => folder
    .add("words", "string", { array: true })
    .add("enabled", "boolean", { default: false })
    .add("blacklistedChannels", "channel", { array: true }));
