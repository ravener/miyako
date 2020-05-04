// Load discord.js extensions.
require("./extensions/GuildMember.js");
require("./extensions/Message.js");
require("./extensions/Guild.js");
require("./extensions/User.js");

const MiyakoClient = require("./structures/MiyakoClient.js");

// Login.
new MiyakoClient().login();
