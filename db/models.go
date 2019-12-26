package db

// Models/Schema/Structs used in the DB.

type Guild struct {
  ID string `db:"id"`
  Prefix string `db:"prefix"`
}

type Bot struct {
  ID string `db:"id"`
  PSA struct {
    Text string `db:"text"`
    Date int64 `db:"date"`
  } `db:"psa"`
}

type Member struct {
  ID string `db:"id"`
  Guild string `db:"guild"`
  Points int64 `db:"points"`
  Level int `db:"level"`
}
