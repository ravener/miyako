package owner

import (
  "bytes"
  "fmt"
  "os/exec"
  "github.com/sapphire-cord/sapphire"
)

// Executes shell commands.
// Usage: <command:string...>
func OwnerExec(ctx *sapphire.CommandContext) {
  var stdout bytes.Buffer
  var stderr bytes.Buffer
  cmd := exec.Command("bash", "-c", ctx.JoinedArgs())
  cmd.Stdout = &stdout
  cmd.Stderr = &stderr

  err := cmd.Run()
  stdoutstr := stdout.String()
  stderrstr := stderr.String()
  var out string = ""

  if stdoutstr != "" {
    out += fmt.Sprintf("**`STDOUT:`**```\n%s```\n", stdoutstr)
  }

  if stderrstr != "" {
    out += fmt.Sprintf("**`STDERR:`**```\n%s```\n", stderrstr)
  }

  if err != nil {
    out += fmt.Sprintf("**`ERROR:`** ```\n%s```", err)
  }

  if out == "" {
    out = "```No Output.```"
  }

  if len(out) > 2048 {
    ctx.Reply("Output too long.")
    return
  }
  ctx.Reply(out)
}
