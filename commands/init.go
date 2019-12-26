// Package commands is the main entry point where all commands are registered.
// Auto-Generated with spgen DO NOT EDIT.
// To use this file import the package in your entry file and initialize it with commands.Init(bot)
package commands

import (
	"github.com/pollen5/taiga/commands/canvas"
	"github.com/pollen5/taiga/commands/config"
	"github.com/pollen5/taiga/commands/developer"
	"github.com/pollen5/taiga/commands/fun"
	"github.com/pollen5/taiga/commands/general"
	"github.com/pollen5/taiga/commands/misc"
	"github.com/pollen5/taiga/commands/owner"
	"github.com/pollen5/taiga/commands/social"
	"github.com/pollen5/taiga/commands/test"
	"github.com/pollen5/taiga/commands/utility"
	"github.com/sapphire-cord/sapphire"
)

func Init(bot *sapphire.Bot) {
	bot.AddCommand(sapphire.NewCommand("color", "Canvas", canvas.Color).SetDescription("View a color by hex.").SetUsage("<hex:string>").SetCooldown(3).AddAliases("colour"))
	bot.AddCommand(sapphire.NewCommand("packagephobia", "Developer", developer.PackagePhobia).SetDescription("Shows the install/publish size of a npm package.").SetUsage("<package:string>").AddAliases("npmsize"))
	bot.AddCommand(sapphire.NewCommand("github", "Developer", developer.Github).SetDescription("View a GitHub repository details.").SetUsage("<repo:string>").SetCooldown(3).AddAliases("gh"))
	bot.AddCommand(sapphire.NewCommand("npm", "Developer", developer.NPM).SetDescription("Search the NPM registry for information about a package.").SetUsage("<package:string>").SetCooldown(5).AddAliases("npmpackage", "npmpkg", "nodepackagemanager"))
	bot.AddCommand(sapphire.NewCommand("yomomma", "Fun", fun.Yomomma).SetDescription("Get a random yo momma joke.").SetUsage("[@user]").AddAliases("urmom"))
	bot.AddCommand(sapphire.NewCommand("compliment", "Fun", fun.Compliment).SetDescription("Compliments a user.").SetUsage("[@user]"))
	bot.AddCommand(sapphire.NewCommand("insult", "Fun", fun.Insult).SetDescription("Insults who you mention.").SetUsage("<@user>"))
	bot.AddCommand(sapphire.NewCommand("lmgtfy", "Fun", fun.Lmgtfy).SetDescription("Let me google it for you!").SetUsage("<query:string...>").AddAliases("letmegoogleitforyou"))
	bot.AddCommand(sapphire.NewCommand("catfacts", "Fun", fun.Catfacts).SetDescription("Let me tell you a misterious cat fact.").SetCooldown(3).AddAliases("catfact", "kittenfact"))
	bot.AddCommand(sapphire.NewCommand("yugioh", "Fun", fun.Yugioh).SetDescription("Get information about a Yu-Gi-Oh! card.").SetUsage("<name:string...>").AddAliases("ygo", "yugi"))
	bot.AddCommand(sapphire.NewCommand("numberfact", "Fun", fun.Numberfact).SetDescription("Get a fact about a number.").SetUsage("[number:int]").AddAliases("numfact", "numfacts", "numbefacts"))
	bot.AddCommand(sapphire.NewCommand("urban", "Fun", fun.Urban).SetDescription("Search up urban dictionary for a term.").SetUsage("<term:string...>").AddAliases("ud", "urbandict", "urbandictionary"))
	bot.AddCommand(sapphire.NewCommand("eightball", "Fun", fun.Eightball).SetDescription("Ask the magic 8ball a question!").SetUsage("<question...>").AddAliases("8ball"))
	bot.AddCommand(sapphire.NewCommand("minesweeper", "Fun", fun.Minesweeper).SetDescription("Play minesweeper!").AddAliases("ms"))
	bot.AddCommand(sapphire.NewCommand("reverse", "Fun", fun.Reverse).SetDescription("Reverses a given input").SetUsage("<text...>").AddAliases("rev"))
	bot.AddCommand(sapphire.NewCommand("ship", "Fun", fun.Ship).SetDescription("Ship someone.").SetUsage("<@@one> [@@two]").SetGuildOnly(true).AddAliases("love", "lovecalc", "lovecalculator"))
	bot.AddCommand(sapphire.NewCommand("say", "Fun", fun.Say).SetDescription("Replies back with what you say").SetUsage("<msg:string...>").AddAliases("repeat", "echo"))
	bot.AddCommand(sapphire.NewCommand("mimic", "Misc", misc.Mimic).SetDescription("Copy someone and talk as them.").SetUsage("<@user> <message:string...>").SetGuildOnly(true).AddAliases("copycat"))
	bot.AddCommand(sapphire.NewCommand("serverinfo", "Utility", utility.Serverinfo).SetDescription("Gets information about the current server.").SetGuildOnly(true).AddAliases("si", "gi", "guildinfo", "guild", "server"))
	bot.AddCommand(sapphire.NewCommand("wolfram", "Utility", utility.Wolfram).SetDescription("Query Wolfram Alpha with any mathematical question.").SetUsage("<query:string...>").AddAliases("what"))
	bot.AddCommand(sapphire.NewCommand("wikipedia", "Utility", utility.Wikipedia).SetDescription("Finds a Wikipedia Article by title.").SetUsage("<article:string...>").AddAliases("wiki"))
	bot.AddCommand(sapphire.NewCommand("avatar", "Utility", utility.Avatar).SetDescription("View someone's avatar.").SetUsage("[@user]").AddAliases("av", "pfp"))
	bot.AddCommand(sapphire.NewCommand("image", "Utility", utility.Image).SetDescription("Get an image from Bing.").SetUsage("<query:string...>").SetCooldown(5).AddAliases("imgsearch", "imagesearch", "searchimage", "searchimg", "img"))
	bot.AddCommand(sapphire.NewCommand("base64", "Utility", utility.Base64).SetDescription("Encode/Decode Base64 strings.").SetUsage("<action:string> <args:string...>"))
	bot.AddCommand(sapphire.NewCommand("lyrics", "Utility", utility.Lyrics).SetDescription("Search song lyrics").SetUsage("<query:string...>").SetCooldown(5))
	bot.AddCommand(sapphire.NewCommand("prefix", "Config", config.Prefix).SetDescription("Sets the prefix for this server.").SetUsage("[prefix:string]").SetGuildOnly(true).AddAliases("setprefix", "changeprefix"))
	bot.AddCommand(sapphire.NewCommand("support", "General", general.Support).SetDescription("Get the link to our Discord server.").AddAliases("discord", "server"))
	bot.AddCommand(sapphire.NewCommand("info", "General", general.Info).SetDescription("Get some information about the bot.").SetGuildOnly(true).AddAliases("botinfo"))
	bot.AddCommand(sapphire.NewCommand("dbstats", "Owner", owner.OwnerDBStats).SetDescription("View statistics about the database.").SetOwnerOnly(true))
	bot.AddCommand(sapphire.NewCommand("dbping", "Owner", owner.OwnerDBPing).SetDescription("Pings the database.").SetOwnerOnly(true).AddAliases("pingdb"))
	bot.AddCommand(sapphire.NewCommand("sql", "Owner", owner.OwnerSQL).SetDescription("Execute some SQL queries.").SetOwnerOnly(true).SetUsage("<query:string...>"))
	bot.AddCommand(sapphire.NewCommand("setavatar", "Owner", owner.OwnerSetAvatar).SetDescription("Sets the bot's avatar.").SetOwnerOnly(true).SetUsage("<avatar:string>").AddAliases("setav", "changeavatar", "changeav"))
	bot.AddCommand(sapphire.NewCommand("exec", "Owner", owner.OwnerExec).SetDescription("Executes shell commands.").SetOwnerOnly(true).SetUsage("<command:string...>"))
	bot.AddCommand(sapphire.NewCommand("eval", "Owner", owner.OwnerEval).SetDescription("Evaluates arbitrary JavaScript.").SetOwnerOnly(true).SetUsage("<code:string...>").AddAliases("ev"))
	bot.AddCommand(sapphire.NewCommand("anko", "Owner", owner.Anko).SetDescription("Evaluates arbitrary Anko").SetUsage("<code:string...>"))
	bot.AddCommand(sapphire.NewCommand("sudo", "Owner", owner.OwnerSudo).SetDescription("Run a command as another user.").SetOwnerOnly(true).SetUsage("<@user> <command:string> [args:string...]"))
	bot.AddCommand(sapphire.NewCommand("shutdown", "Owner", owner.OwnerShutdown).SetDescription("Shuts down the bot.").SetOwnerOnly(true).AddAliases("reboot"))
	bot.AddCommand(sapphire.NewCommand("lua", "Owner", owner.OwnerLua).SetDescription("Evaluates arbitrary lua.").SetOwnerOnly(true).SetUsage("<code:string...>"))
	bot.AddCommand(sapphire.NewCommand("starlark", "Owner", owner.OwnerStarlark).SetDescription("Evaluates Arbitrary Python").SetOwnerOnly(true).SetUsage("<code:string...>").AddAliases("py", "python", "sl"))
	bot.AddCommand(sapphire.NewCommand("balance", "Social", social.Balance).SetDescription("View your balance or someone else's.").SetUsage("[@@member]").SetGuildOnly(true).AddAliases("bal", "points"))
	bot.AddCommand(sapphire.NewCommand("flags", "Test", test.Flags).SetDescription("Tests flags and args"))
	bot.AddCommand(sapphire.NewCommand("cooldown", "Test", test.Cooldown).SetDescription("Testing cooldowns").SetCooldown(10))
	bot.AddCommand(sapphire.NewCommand("paginate", "Test", test.Paginate).SetDescription("Tests sapphire's paginator."))
}
