package fun

import (
  "github.com/sapphire-cord/sapphire"
)

// Replies back with what you say
// Usage: <msg:string...>
// Aliases: repeat, echo
func Say(ctx *sapphire.CommandContext) {
  ctx.Reply(sapphire.Escape(ctx.JoinedArgs()))
}
