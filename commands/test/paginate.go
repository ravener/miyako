package test

import (
  "github.com/sapphire-cord/sapphire"
  "fmt"
)

// Tests sapphire's paginator.
func Paginate(ctx *sapphire.CommandContext) {
  p := sapphire.NewPaginatorForContext(ctx)
  p.SetTemplate(func() *sapphire.Embed {
    return sapphire.NewEmbed().SetColor(0xDFAC7C)
  })

  for x := 0; x < 10; x++ {
    p.AddPageString(fmt.Sprintf("Lol %d", x + 1))
  }
  p.Run()
}
