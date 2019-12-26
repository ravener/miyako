package owner

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
  "github.com/olekukonko/tablewriter"
  "bytes"
)

// Execute some SQL queries.
// Usage: <query:string...>
func OwnerSQL(ctx *sapphire.CommandContext) {
  rows, err := db.Query(ctx.JoinedArgs())

  if err != nil {
    ctx.CodeBlock("", err.Error())
    return
  }

  cols, err := rows.Columns()

  if err != nil {
    ctx.CodeBlock("", err.Error())
    return
  }

  rawResult := make([][]byte, len(cols))
  result := make([]string, len(cols))
  dest := make([]interface{}, len(cols)) // A temporary interface{} slice

  for i, _ := range rawResult {
    dest[i] = &rawResult[i] // Put pointers to each string in the interface slice
  }

  b := &bytes.Buffer{}
  table := tablewriter.NewWriter(b)
  table.SetHeader(cols)

  for rows.Next() {
    err := rows.Scan(dest...)
    if err != nil {
      ctx.CodeBlock("", err.Error())
      return
    }

    for i, raw := range rawResult {
      if raw == nil {
        result[i] = ""
      } else {
        result[i] = string(raw)
      }
    }
    table.Append(result)
  }

  defer rows.Close()
  table.Render()
  str := b.String()

  if len(str) > 2040 {
    ctx.Reply("Results too long.")
    return
  }

  ctx.CodeBlock("", str)
}
