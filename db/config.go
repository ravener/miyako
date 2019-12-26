package db

import (
  "github.com/pollen5/taiga/constants"
)

// Helper functions to get a specific row from the DB.

func GetPrefix(id string) string {
  var g Guild
  err := Get(&g, "SELECT prefix FROM guilds WHERE id = $1", id)
  if err != nil {
    return "t!"
  }
  return g.Prefix
}

func GetBalance(id, guild string) int64 {
  var m Member

  err := Get(&m, "SELECT points FROM members WHERE id = $1 AND guild = $2", id, guild)

  if err != nil {
    return 0
  }

  return m.Points
}

func GetGuild(id string) (*Guild, error) {
  var g Guild
  err := Get(&g, "SELECT * FROM guilds WHERE id = $1", id)
  if err != nil { return nil, err }
  return &g, nil
}

func SetPrefix(guild, prefix string) error {
  _, err := Exec("UPDATE guilds SET PREFIX = $1 WHERE id = $2", prefix, guild)
  return err
}

func GetBotData() (*Bot, error) {
  var b Bot
  err := Get(&b, "SELECT * FROM client WHERE id = $1", constants.BotID)
  if err != nil { return nil, err }
  return &b, nil
}
