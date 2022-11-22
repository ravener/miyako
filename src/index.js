require("dotenv").config();

const MiyakoClient = require("./structures/MiyakoClient.js");

const client = new MiyakoClient();
client.login();
