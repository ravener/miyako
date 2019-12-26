package owner

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
  "time"
)

// Pings the database.
// aliases: pingdb
func OwnerDBPing(ctx *sapphire.CommandContext) {
  before := time.Now()
  err := db.DB.Ping()

  if err != nil {
    ctx.Reply("Failed to ping DB: ```\n%s```", err)
    return
  }

  after := time.Now()
  ctx.Reply("DB Ping Latency: **%d** ms", int(after.Sub(before).Milliseconds()))
}
