export function removeBlankLines(string: string) {
  return string.replace(/^\s*$(?:\r\n?|\n)/gm, '')
}
