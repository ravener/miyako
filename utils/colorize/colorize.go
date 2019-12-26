package colorize

import (
  "fmt"
)

const Reset = "\x1b[0m"

func format(code int, str string) string {
  return fmt.Sprintf("\x1b[%dm%s%s", code, str, Reset)
}

func Blue(str string) string {
  return format(34, str)
}

func Cyan(str string) string {
  return format(36, str)
}

func Yellow(str string) string {
  return format(33, str)
}

func Green(str string) string {
  return format(32, str)
}

func Red(str string) string {
  return format(31, str)
}

func Magenta(str string) string {
  return format(35, str)
}

func Bright(str string) string {
  return format(1, str)
}

func Dim(str string) string {
  return format(2, str)
}

func Underscore(str string) string {
  return format(4, str)
}
