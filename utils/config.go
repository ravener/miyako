package utils

import (
  "io/ioutil"
  "encoding/json"
)

var conf map[string]string

func GetConfig(key string) string {
  val, ok := conf[key]
  if !ok { return "" } else { return val }
}

func init() {
  data, err := ioutil.ReadFile("config.json")
  if err != nil {
    panic(err)
  }
  err = json.Unmarshal(data, &conf)
  if err != nil { panic(err) }
}
