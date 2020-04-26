# Miyako

[![Discord](https://discordapp.com/api/guilds/397479560876261377/embed.png)](https://discord.gg/mDkMbEh)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6686554194274006a8f8ec3122b46902)](https://www.codacy.com/manual/pollen5/miyako?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pollen5/miyako&amp;utm_campaign=Badge_Grade)
[![Discord Bots](https://top.gg/api/widget/status/397796982120382464.svg)](https://top.gg/bot/397796982120382464)

Miyako is a multipurpose [Discord](https://discordapp.com) Bot

[![Discord Bots](https://top.gg/api/widget/397796982120382464.svg)](https://top.gg/bot/397796982120382464)

This repository contains the always up to date code for the bot so you can contribute if you want. If you just want to use the bot [invite link](https://discordapp.com/oauth2/authorize?client_id=397796982120382464&permissions=1345350758&scope=bot)

## Running it yourself
Requirements:
- Node.js v12+ (Version requirement may change at any time.)
- PostgreSQL

Clone the repository or fetch it however you want:
```sh
$ git clone https://github.com/pollen5/miyako
$ cd miyako
```
Install dependencies (don't worry I'm very picky about dependencies and keep it very minimal)
```sh
$ npm install
```
Copy `config.json.example` to `config.json` and fill the fields.

Finally run the bot using `node index.js` (use pm2/nodemon whatever you want)

For the first time the bot will automatically create the database schemas, it isn't future proof though so if you decide to update the bot be careful of schema changes that you will have to manually update.

Self-hosting is more aimed towards contributing rather than running your own instance, there will be lot of changes you have to do to make it truly yours which is not recommended and you will not recieve support.

## License
Miyako's code can be used for any purposes under the [MIT License](LICENSE)
