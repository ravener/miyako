const { Client } = require("klasa");

Client.use(require("klasa-member-gateway"));

module.exports.defaultGuildSchema = Client.defaultGuildSchema
  .add("welcome", (folder) => folder
    .add("channel", "channel")
    .add("message", "string")
    .add("enabled", "boolean"))
  .add("leave", (folder) => folder
    .add("channel", "channel")
    .add("message", "string")
    .add("enabled", "boolean"))
  .add("tags", "any", { array: true })
  .add("modlogs", (folder) => folder
    .add("channel", "channel")
    .add("enabled", "boolean")
    .add("ban", "boolean")
    .add("kick", "boolean")
    .add("invites", "boolean")
    .add("messages", "boolean")
    .add("roles", "boolean")
    .add("channels", "boolean")
    .add("mute", "boolean")
    .add("leave", "boolean")
    .add("join", "boolean")
    .add("warn", "boolean"));

module.exports.defaultUserSchema = Client.defaultUserSchema
  .add("afk", (folder) => folder
    .add("status", "boolean")
    .add("message", "string"));

module.exports.defaultClientSchema = Client.defaultClientSchema
  .add("psa", (folder) => folder
    .add("message", "string")
    .add("date", "integer"));

module.exports.defaultMemberSchema = Client.defaultMemberSchema
  .add("points", "integer")
  .add("level", "integer");
