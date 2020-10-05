export default function toTypescriptType(s: string, format?: string) {
  if (s === undefined || s === null || s.length === 0) {
    return 'any | null'
  }

  let result = ''

  switch (s) {
    case 'boolean':
    case 'bool':
    case 'Boolean':
      result = 'boolean'
      break

    case 'array':
      result = '[]'
      break

    case 'Int64':
    case 'Int32':
    case 'int':
    case 'integer':
    case 'number':
      result = 'number'
      break

    case 'Guid':
    case 'String':
    case 'string':
    case 'uuid':
      switch (format) {
        case 'date':
        case 'date-time':
          result = 'Date'
          break
        default:
          result = 'string'
      }
      break

    case 'file':
      result = 'any'
      break

    default:
      result = s
      break
  }

  return result
}
