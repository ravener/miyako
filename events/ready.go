package events

import (
  "github.com/bwmarrin/discordgo"
)

func Ready(s *discordgo.Session, r *discordgo.Ready) {
  logger.Infof("Logged in as %s (%s)", r.User.String(), r.User.ID)
}
