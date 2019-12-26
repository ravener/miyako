package fun

import (
  "github.com/pollen5/taiga/utils"
  "github.com/sapphire-cord/sapphire"
)

// Play minesweeper!
// Aliases: ms
func Minesweeper(ctx *sapphire.CommandContext) {
  var emojis = []string{":one:", ":two:", ":boom:", ":three:", ":four:", ":five:", ":boom:"}
  ms := ""
  for x := 0; x < 9; x++ {
    for i := 0; i < 9; i++ {
      ms += ("|| " + emojis[utils.RandNumber(len(emojis))] + " ||")
      if i != 8 {
        ms += " "
      }
    }
    ms += "\n"
  }
  ctx.BuildEmbed(sapphire.NewEmbed().
    SetColor(0xDFAC7C).
    SetDescription(ms).
    SetTitle("Minesweeper"))
}
