package general

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
  "fmt"
)

// Get some information about the bot.
// Aliases: botinfo
// guild only
func Info(ctx *sapphire.CommandContext) {
  prefix := db.GetPrefix(ctx.Guild.ID)

  ctx.Reply(fmt.Sprintf("Hey there **%s-san**! I am **Aisaka Taiga**. I'm a general purpose Discord Bot made by **PoLLeN#5796**, my aim is to provide you with everything you will ever need in your Discord servers! The prefix in this server is `%s` run %shelp for a list of commands you can use and if you ever have any questions our team is happy to help at https://discord.gg/mDkMbEh\n\nThis bot is also Open-Source on GitHub! https://github.com/pollen5/taiga if you use GitHub make sure you give me a star! ;)",
    ctx.Author.Username, prefix, prefix)) // TODO: dynamic prefixes.
}
