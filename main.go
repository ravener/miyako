package main

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/bwmarrin/discordgo"
  "github.com/pollen5/taiga/db"
  "github.com/pollen5/taiga/utils"
  "github.com/pollen5/taiga/commands"
  "github.com/pollen5/taiga/constants"
  "github.com/pollen5/taiga/events"
  "time"
  "fmt"
  "flag"
)

const banner = "    ___    _            __            ______      _            \n   /   |  (_)________ _/ /______ _   /_  __/___ _(_)___ _____ _\n  / /| | / / ___/ __ `/ //_/ __ `/    / / / __ `/ / __ `/ __ `/\n / ___ |/ (__  ) /_/ / ,< / /_/ /    / / / /_/ / / /_/ / /_/ / \n/_/  |_/_/____/\\__,_/_/|_|\\__,_/    /_/  \\__,_/_/\\__, /\\__,_/  \n                                                /____/         \n"

var initdb = flag.Bool("initdb", false, "Initializes the database schema (use only at first startup)")
var dev = flag.Bool("dev", false, "Run bot in development mode.")

func main() {
  flag.Parse()

  // Only create the database tables and exit.
  if *initdb {
    utils.Logger.Info("Creating database schemas...")
    before := time.Now()
    db.MustExec(db.SCHEMA)
    after := time.Now()
    utils.Logger.Infof("Schema creation took %d ms", after.Sub(before).Milliseconds())
    fmt.Println("Successfully created database schemas. You may now proceed to start the bot.")
    return
  }

  // Fancy banners and stuff.
  fmt.Println(banner)
  fmt.Printf("Aisaka Taiga Discord Bot (Version: %s)\n", constants.Version)

  token := utils.GetConfig("token")

  if *dev {
    token = utils.GetConfig("devtoken")
  }

  dg, err := discordgo.New(token)

  if err != nil {
    panic(err)
  }

  bot := sapphire.New(dg)

  // Configure
  bot.OwnerID = "292690616285134850"
  bot.SetErrorHandler(utils.ErrorHandler)

  bot.SetPrefixHandler(func(bot *sapphire.Bot, msg *discordgo.Message, dm bool) string {
    if dm { return "t!" }
    return db.GetPrefix(msg.GuildID)
  })

  bot.SetInvitePerms(2016537702)

  // Initialize
  bot.LoadBuiltins()
  commands.Init(bot)
  events.Init(dg)

  bot.MustConnect()
  bot.Wait()

  // Cleanup
  db.Close()
}
