package owner

import (
  "github.com/sapphire-cord/sapphire"
)

// Run a command as another user.
// Usage: <@user> <command:string> [args:string...]
func OwnerSudo(ctx *sapphire.CommandContext) {
  cmd := ctx.Bot.GetCommand(ctx.Arg(1).AsString())

  if cmd == nil {
    ctx.Reply("Invalid command.")
    return
  }

  // Create the faked context with the specified user and command.
  cctx := &sapphire.CommandContext{
    Bot: ctx.Bot,
    Command: cmd,
    Message: ctx.Message,
    Channel: ctx.Channel,
    Session: ctx.Session,
    Author: ctx.Arg(0).AsUser(),
    RawArgs: ctx.RawArgs[2:],
    Prefix: ctx.Prefix,
    Guild: ctx.Guild,
    Flags: ctx.Flags,
    Locale: ctx.Locale,
    InvokedName: ctx.Arg(1).AsString(),
  }

  if !cctx.ParseArgs() {
    return
  }

  cmd.Run(cctx)
}
