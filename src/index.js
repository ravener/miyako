require("dotenv").config();

const { GatewayIntentBits } = require("discord.js");
const MiyakoClient = require("./structures/MiyakoClient.js");

const client = new MiyakoClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ],
  allowedMentions: { parse: ["users"] }
});

client.login();
