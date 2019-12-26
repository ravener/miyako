package owner

import (
  "os"
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
)

// Shuts down the bot.
// Aliases: reboot
func OwnerShutdown(ctx *sapphire.CommandContext) {
  ctx.Reply("Shutting down...")

  // Cleanly close the session and the database.
  ctx.Session.Close()
  db.Close()

  os.Exit(0)
}
