package owner

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/dop251/goja"
  "github.com/pollen5/taiga/constants"
)

// Evaluates arbitrary JavaScript.
// Usage: <code:string...>
// Aliases: ev
func OwnerEval(ctx *sapphire.CommandContext) {
  vm := goja.New()

  vm.Set("ctx", ctx)
  vm.Set("bot", ctx.Bot)
  vm.Set("session", ctx.Session)

  value, err := vm.RunString(ctx.JoinedArgs())

  if err != nil {
    ctx.React(constants.CrossMark)
    ctx.CodeBlock("js", "%s", err)
    return
  }

  ctx.CodeBlock("js", "%s", value)
  ctx.React(constants.CheckMark)
}
