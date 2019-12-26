package fun

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/urban-go"
  "github.com/pollen5/taiga/utils"
  "fmt"
)

// Search up urban dictionary for a term.
// Usage: <term:string...>
// Aliases: ud, urbandict, urbandictionary
func Urban(ctx *sapphire.CommandContext) {
  if !ctx.Channel.NSFW {
    ctx.Reply("You can use urban in NSFW channels only! Sorry but it has inappropriate words which could be against Discord's ToS (Terms of Services).")
    return
  }

  res, err := urban.Define(ctx.JoinedArgs())

  if err != nil {
    ctx.Error(err)
    return
  }

  p := sapphire.NewPaginatorForContext(ctx)

  p.SetTemplate(func() *sapphire.Embed {
    return sapphire.NewEmbed().
      SetTitle("Urban Dictionary").
      SetColor(0xDFAC7C)
  })

  for _, entry := range res {
    format := fmt.Sprintf("%s\n\n*%s*",
      urban.Markdown(entry.Definition),
      urban.Markdown(entry.Example))

    if len(format) > 2000 {
      format = fmt.Sprintf("%s\n\n*%s*", entry.Definition, entry.Example)
    }

    format = utils.Trim(format, 2000)

    p.AddPageString(fmt.Sprintf("%s\n\n**Votes** :thumbsup: %d :thumbsdown: %d\n\nDefinition written by **%s**",
      format,
      entry.ThumbsUp,
      entry.ThumbsDown,
      entry.Author,
    ))
  }

  p.Run()
}
