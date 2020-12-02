/**
 * Entry file.
 * Try to keep this file minimum and abstract most of the functionality in seperate files.
 *
 * @author Raven
 * @license MIT
 */

// Load .env
require("dotenv").config();

// Setup Module Alias.
const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@utils":      __dirname + "/src/utils",
  "@structures": __dirname + "/src/structures",
  "@json":       __dirname + "/assets/json",
  "@languages":  __dirname + "/src/languages"
});

// Load discord.js extensions.
require("./src/extensions/GuildMember.js");
require("./src/extensions/TextChannel.js");
require("./src/extensions/DMChannel.js");
require("./src/extensions/Message.js");
require("./src/extensions/Guild.js");
require("./src/extensions/User.js");

// Import the Client.
const MiyakoClient = require("./src/structures/MiyakoClient.js");

// Login. (And start in development mode if --dev is passed)
new MiyakoClient(process.argv.includes("--dev")).login();
