package config

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
)

// TODO: permissions

// Sets the prefix for this server.
// Usage: [prefix:string]
// Aliases: setprefix, changeprefix
// guild only
func Prefix(ctx *sapphire.CommandContext) {
  // If no arguments, show the existing prefix.
  // e.g for lost people to use @botname prefix
  if !ctx.HasArgs() {
    ctx.Reply("The current prefix for this server is `%s`", db.GetPrefix(ctx.Guild.ID))
    return
  }

  prefix := ctx.Arg(0).AsString()

  // Set a soft limit to prevent spam.
  if len(prefix) > 10 {
    ctx.Reply("Prefix must not be longer than 10 characters.")
    return
  }

  _, err := db.Exec("INSERT INTO guilds (id, prefix) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET prefix=$2", ctx.Guild.ID, prefix)
  if err != nil {
    ctx.Error(err)
    return
  }

  ctx.Reply("Successfully updated the prefix for this server to `%s`", prefix)
}
