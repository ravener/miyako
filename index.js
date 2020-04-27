require("./extensions/GuildMember.js");
require("./extensions/Message.js");
const MiyakoClient = require("./structures/MiyakoClient.js");

new MiyakoClient()
  .login();
