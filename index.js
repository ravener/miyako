require("./extensions/GuildMember.js");
require("./extensions/Message.js");
require("./extensions/Guild.js");
const MiyakoClient = require("./structures/MiyakoClient.js");

new MiyakoClient()
  .login();
