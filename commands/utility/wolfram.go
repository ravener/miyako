package utility

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/utils"
  "net/http"
  "net/url"
  "io/ioutil"
  "encoding/json"
)

// Query Wolfram Alpha with any mathematical question.
// Usage: <query:string...>
// Aliases: what
func Wolfram(ctx *sapphire.CommandContext) {
  input := ctx.JoinedArgs()

  // If the "what" alias was used treat it as an argument aswell.
  if ctx.InvokedName == "what" {
    input = "What " + input
  }

  query := url.Values{}
  query.Add("input", input)
  query.Add("primary", "true")
  query.Add("appid", utils.GetConfig("wolfram"))
  query.Add("output", "json")

  res, err := http.Get("http://api.wolframalpha.com/v2/query?" + query.Encode())

  if err != nil {
    ctx.Error(err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Error("Wolfram returned non-200 status: %d (%s)", res.StatusCode, res.Status)
    return
  }

  var data struct {
    Result struct {
      Pods []struct {
        SubPods []struct {
          Text string `json:"plaintext"`
        } `json:"subpods"`
      } `json:"pods"`
    } `json:"queryresult"`
  }

  buf, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Error(err)
    return
  }

  err = json.Unmarshal(buf, &data)

  if err != nil {
    ctx.Error(err)
    return
  }

  if len(data.Result.Pods) < 2 {
    ctx.Reply("Couldn't find an answer to that question!")
    return
  }

  answer := data.Result.Pods[1].SubPods[0].Text

  if len(answer) > 1500 {
    answer = answer[:1500]
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle(data.Result.Pods[0].SubPods[0].Text).
    SetDescription(answer).
    SetColor(0xDFAC7C))
}
