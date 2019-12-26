package utils

import (
  "math/rand"
  "time"
  "github.com/pollen5/taiga/constants"
  "github.com/bwmarrin/discordgo"
  "github.com/pollen5/minori"
  "github.com/sapphire-cord/sapphire"
  "fmt"
)

var Logger = minori.GetLogger("Aisaka Taiga")

var Rand = rand.New(rand.NewSource(time.Now().Unix()))

func RandNumber(r int) int {
  return Rand.Intn(r)
}

func Roll(ls []string) string {
  return ls[RandNumber(len(ls))]
}

// Trim trims down extra characters that hit the limit and appends "..." at the end to signify trimmed output.
func Trim(text string, limit int) string {
  if len(text) > limit {
    return text[:limit - 3] + "..."
  }

  return text
}

func ErrorHandler(bot *sapphire.Bot, err interface{}) {
  if cmd, ok := err.(*sapphire.CommandError); ok {
    ctx := cmd.Context

    g := "DM"
    gid := ctx.Channel.ID

    if ctx.Guild != nil {
      g = ctx.Guild.Name
      gid = ctx.Guild.ID
    }

    bot.Session.ChannelMessageSendEmbed(constants.LogsChannelID, &discordgo.MessageEmbed{
      Title: "Command Error - " + ctx.Command.Name,
      Description: fmt.Sprintf("Content: %s\n```\n%s```", ctx.Message.Content, cmd.Error()),
      Color: 0xDFAC7C,
      Footer: &discordgo.MessageEmbedFooter{
        Text: fmt.Sprintf("Author: %s (%s), Guild: %s (%s)", ctx.Author.Username, ctx.Author.ID, g, gid),
      },
    })

    Logger.Errorf("Command Error (%s): %s (Author: %s (%s), Guild: %s (%s))", ctx.Command.Name, cmd.Error(), ctx.Author.Username, ctx.Author.ID, g, gid)
    ctx.ReplyLocale("COMMAND_ERROR")
    return
  }

  bot.Session.ChannelMessageSendEmbed(constants.LogsChannelID, &discordgo.MessageEmbed{
    Title: "Panic Recovered",
    Description: fmt.Sprint(err),
    Color: 0xDFAC7C,
  })

  Logger.Error(err)
}
