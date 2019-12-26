package fun

import (
  "net/http"
  "encoding/json"
  "io/ioutil"
  "github.com/bwmarrin/discordgo"
  "github.com/sapphire-cord/sapphire"
)

// Get a random cat image!
// Cooldown: 3
func cat(ctx *sapphire.CommandContext) {
  res, err := http.Get("https://aws.random.cat/meow")

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  var d map[string]string
  err = json.Unmarshal(body, &d)

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  ctx.ReplyEmbed(&discordgo.MessageEmbed{
    Title: "Random Cat",
    Color: 0xFFD700,
    Image: &discordgo.MessageEmbedImage{URL: d["file"]},
    Author: &discordgo.MessageEmbedAuthor{Name: ctx.Author.Username, IconURL: ctx.Author.AvatarURL("256")},
  })
}
