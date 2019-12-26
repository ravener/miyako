package test

import (
  "github.com/sapphire-cord/sapphire"
)

// Testing cooldowns
// cooldown: 10
func Cooldown(ctx *sapphire.CommandContext) {
  ctx.Reply("This command just ran.")
}
