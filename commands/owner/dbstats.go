package owner

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
  "strconv"
  "fmt"
)

// View statistics about the database.
func OwnerDBStats(ctx *sapphire.CommandContext) {
  stats := db.DB.Stats()

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle("Database Statistics").
    SetColor(0xDFAC7C).
    SetAuthor(ctx.Author.Username, ctx.Author.AvatarURL("256")).
    AddField("Max Open Connections", strconv.Itoa(stats.MaxOpenConnections)).
    AddField("Pool Status", fmt.Sprintf("**Open Connections:** %d\n**In Use:** %d\n**Idle:** %d",
      stats.OpenConnections, stats.InUse, stats.Idle)).
      AddField("Counters", fmt.Sprintf("**Wait Count:** %d\n**Wait Duration:** %d ms\n**Max Idle Closed:** %d\n**Max Lifetime Closed:** %d",
        stats.WaitCount, stats.WaitDuration.Milliseconds(), stats.MaxIdleClosed, stats.MaxLifetimeClosed)))
}
