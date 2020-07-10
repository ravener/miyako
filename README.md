# Miyako (宮古)

[![Discord](https://discordapp.com/api/guilds/397479560876261377/embed.png)](https://discord.gg/mDkMbEh)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6686554194274006a8f8ec3122b46902)](https://www.codacy.com/manual/pollen5/miyako?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pollen5/miyako&amp;utm_campaign=Badge_Grade)
[![Discord Bots](https://top.gg/api/widget/status/397796982120382464.svg)](https://top.gg/bot/397796982120382464)

Miyako is a multipurpose [Discord](https://discordapp.com) Bot

[![Discord Bots](https://top.gg/api/widget/397796982120382464.svg)](https://top.gg/bot/397796982120382464)

This repository contains the always up to date code for the bot so you can contribute if you want. If you just want to use the bot [invite it here](https://discordapp.com/oauth2/authorize?client_id=397796982120382464&permissions=1345350758&scope=bot)

See [FEATURES.md](FEATURES.md) for a detailed description about the bot itself, it's the file we use for bot lists etc while this README is more from a developer's perspective for this repository.

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for how to contribute and understanding Miyako's code base.

## About Miyako
Here is a (kinda long) story of my bot development on Discord and how this started out.

I made a bunch of bots before but not many was successful, most successful one was me in a team but that died out soon.

I had experience with discord.js and discord.py, Python was my first and the team used it, however I was in love with discord.js at the time too, but at the same time was bored and couldn't decide so after that I made a bot named `Ladybug` with Python and discord.py (In fact I did prototype a command handler in JavaScript with discord.js but I just never released it).

I had made the bot account before for testing purposes before I actually worked on releasing it.
Ladybug was doing great, probably around 100 servers at this point (or likely less) when I found about [Klasa](https://github.com/dirigeants/klasa) and it looked cool which motivated me to get back at discord.js.

I immediately jumped to rewriting it to Klasa (The python version is [archived here](https://github.com/pollen5/ladybug-archive)).
The klasa rewrite was a success, it was going great I had fun, I made about 149 commands and by the end it had about 300 servers.

Slowly I got bored of Klasa felt nothing interesting was going on and lot of my code was messed up, felt like I'm doing everything wrong and it had high memory usage which annoyed me.

The ram usage could do as far as 500 MB, I felt that was too much, lot of people were clearing cache to free up memory but my code depended a lot on the cache in many places so it wasn't an option but I did avoid those mistakes in the current version.

I found about Golang, I loved the simplicity and it had pretty low memory use so I thought I should rewrite to Golang now that everything is messed up.
I had hard time figuring out a good code structure, reading the existed bots had very messed up structure and mainly manually registering commands, I came with a simple structure that I felt comfortable and wrote some commands but then I got an idea and built up a Klasa-like framework for Go (which is [archived here](https://github.com/sapphire-cord/sapphire)) so I rewrote my code to use my new framework which was public this time and not just for my bot.
Rewriting it took so long. My bot was all offline at this point I was afraid of it taking too long and losing servers while it's offline so I pushed to production immediately with lots of functionality still missing I then found out after production release I started to work on it less and less and eventually decided to stop working on it.
Go is simple but that simplicity is a con for Discord Bot development we need high level functionality and such to focus on the bot, it took me a long time to build a command as I was too lazy to port the logic and unwrap bunch of readable code into what will look like a mess in Go and finding equivalent libraries.
I was losing confidence in my framework too, felt the design is terrible and could get a rewrite, tried hard to stay motivated and I found out about [arikawa](https://github.com/diamondburned/arikawa) decided discordgo is horrible for me and wanted to rewrite to arikawa instead, however again code structure and structure, their command handler looked like it would make a horrible file structure that's gonna give me OCD every second so I decided to rewrite my Sapphire framework to use arikawa and fix a lot of the design regrets I had so I began writing code but then I decided "screw it" writing this framework will take me ages and I lost all the motivation in discord bots like this. I was trying to get away from JavaScript but I said screw it I'm gonna admit JavaScript is good, I really felt like I needed it when i was suffering with Go, the times I chained promises and used `async`/`await` good days, I missed the syntax and I decided that I don't care about memory usage and such anymore I just want to get work done quickly so I did a yet another rewrite to JavaScript which is this one. (The Go version is [archived here](https://github.com/pollen5/taiga-archive))

This time I didn't want to use Klasa. I took a look at Akairo and Commando but didn't feel like it.
I was always inspired by [Misaki](https://github.com/NotAWeebDev/Misaki) which had its own command handler, it felt fun to have my own that I can have full control over it so I made a manual command handler partially based on Misaki's and this time I don't plan on any more rewrites or killing it.

I have a decent motivation for now to continue developing this.
Porting commands were much easier this way, I managed to copy-paste some of my commands from my Klasa version and slightly editing it and on the way I cleaned up some more code on those commands, so I'm currently very satisfied with the results.

I just would like to have some more core devs/maintainers/supporters and more friends on the way to be with me as this project gets developed. So if you are interested in meeting me join the [Discord Server](https://discord.gg/mDKMbEh) :)

Currently the community is very small and inactive which is the part I'm trying to fix at the moment.
It's been a long time since I had any solid Discord friends and most of my current friends kind of don't care much so I am kinda lonely at this point with this project

## Running it yourself
**Requirements:** (Things that require an external installation)
- Node.js v12+ (Version requirement may change at any time.)
- PostgreSQL 9.5+
- [IMG API](https://github.com/pollen5/img-api) optional but image commands won't work.

**Keys to collect** (not required but the respective command won't work)
- [top.gg](https://top.gg) (json: `dbl`) If your bot is on top.gg this is used for vote checks and stats posting. Running the bot with `--dev` will disable dbl and provide a mocked api. If your bot is not in DBL leave the field empty and the same case as `--dev` applies.
- Giphy (json: `giphy`) For gif command.
- Genius. (json: `genius`) For lyrics API.
- TMDB (json: `tmdb`) for movie/tvshow commands.
- Wolfram Alpha (json: `wolfram`) For wolfram queries.

The bot will run with some of the keys missing but the respective commands are not guarded and will throw errors.

Clone the repository or fetch it however you want:
```sh
$ git clone https://github.com/ravener/miyako
$ cd miyako
```
Install dependencies (don't worry I'm very picky about dependencies and keep it very minimal)
```sh
$ npm install
```
Copy `config.json.example` to `config.json` and fill in the fields.

Finally run the bot using `node index.js` (use pm2/nodemon whatever you want)

For the first time the bot will automatically create the database schemas, it isn't future proof though so if you decide to update the bot be careful of schema changes that you will have to manually update. If you notice a schema change use the builtin `sql` command to run things like `ALTER TABLE xxx ADD COLUMN types...` accordingly as the changes **BEFORE** pulling and running the updated code. This might be annoying but it's your reminder that this bot wasn't specifically made for others to host themselves.

Self-hosting is more aimed towards contributing rather than running your own instance, there will be lot of changes you have to do to make it truly yours which is not recommended and you will not recieve support. That being said I don't mind too much if you run an instance but please don't claim it as your own.

Be sure to join our [support server](https://discord.gg/mDkMbEh) for feedback and discussions when contributing or just to hang out. We like to meet new people so come and say Hi!

If you are planning to contribute be sure to check the [TODO list](TODO.md) for what needs to be done.

## License
Miyako's code can be used for any purposes under the [MIT License](LICENSE)
