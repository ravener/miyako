/**
 * Entry file.
 * Try to keep this file minimum and abstract most of the functionality in seperate files.
 *
 * @author Raven
 * @license MIT
 */

// Setup Module Alias.
require("module-alias/register");

// Load discord.js extensions.
require("./extensions/GuildMember.js");
require("./extensions/TextChannel.js");
require("./extensions/DMChannel.js");
require("./extensions/Message.js");
require("./extensions/Guild.js");
require("./extensions/User.js");

// Import the Client.
const MiyakoClient = require("./structures/MiyakoClient.js");

// Login. (And start in development mode if --dev is passed)
new MiyakoClient(process.argv.includes("--dev")).login();
