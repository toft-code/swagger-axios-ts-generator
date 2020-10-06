export function openapiComment(value: any) {
  return '/*\n' + JSON.stringify(value, null, 2) + '\n*/'
}
