const fs = require("fs");

const langs = fs.readdirSync(__dirname).filter(file => file !== "index.js");

for(const lang of langs) {
  const mod = require(`./${lang}`);
  module.exports[mod.name] = mod;
}
