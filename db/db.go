// Database interaction package.
package db

import (
  _ "github.com/lib/pq"
  "github.com/jmoiron/sqlx"
  "database/sql"
  "github.com/pollen5/taiga/utils"
  "github.com/pollen5/taiga/utils/colorize"
  "github.com/pollen5/minori"
  "fmt"
  "time"
)

var DB *sqlx.DB
var logger = minori.GetLogger("PostgreSQL")

func printParams(args ...interface{}) string {
  str := ""
  for i, arg := range args {
    str += fmt.Sprint(arg)
    if i != len(args) - 1 {
      str += ", "
    }
  }
  return colorize.Bright(colorize.Yellow(str))
}

func Query(query string, args ...interface{}) (*sql.Rows, error) {
  logger.Debugf("SQL Query: %s (%s)", colorize.Bright(colorize.Cyan(query)), printParams(args...))
  return DB.Query(query, args...)
}

func QueryRow(query string, args ...interface{}) *sql.Row {
  logger.Debugf("SQL Query: %s (%s)", colorize.Bright(colorize.Cyan(query)), printParams(args...))
  return DB.QueryRow(query, args...)
}

func Exec(query string, args ...interface{}) (sql.Result, error) {
  logger.Debugf("SQL Query: %s (%s)", colorize.Bright(colorize.Cyan(query)), printParams(args...))
  return DB.Exec(query, args...)
}

func MustExec(query string, args ...interface{}) sql.Result {
  logger.Debugf("SQL Query: %s (%s)", colorize.Bright(colorize.Cyan(query)), printParams(args...))
  return DB.MustExec(query, args...)
}

func Begin() (*sqlx.Tx, error) {
  return DB.Beginx()
}

func MustBegin() *sqlx.Tx {
  return DB.MustBegin()
}

func Close() error {
  logger.Info("Shutting down Database connection...")
  return DB.Close()
}

func Get(dest interface{}, query string, args ...interface{}) error {
  logger.Debugf("SQL Query: %s (%s)", colorize.Bright(colorize.Cyan(query)), printParams(args...))
  return DB.Get(dest, query, args...)
}

func init() {
  logger.Info("Connecting to PostgreSQL...")
  before := time.Now()
  DB = sqlx.MustConnect("postgres", utils.GetConfig("postgresql"))
  after := time.Now()
  logger.Infof("Connected to PostgreSQL! (took: %d ms)", after.Sub(before).Milliseconds())
}
