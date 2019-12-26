package events

import (
  "github.com/bwmarrin/discordgo"
  "github.com/pollen5/minori"
)

var logger = minori.GetLogger("Events")

func Init(s *discordgo.Session) {
  s.AddHandler(Ready)
}
