package test

import (
  "github.com/sapphire-cord/sapphire"
  "strings"
)

// Tests flags and args
func Flags(ctx *sapphire.CommandContext) {
  ctx.Reply("Args: %s, Flags: %+v", strings.Join(ctx.RawArgs, ", "), ctx.Flags)
}
