const upperFirstLetter = (input: string) =>
  input[0].toLocaleUpperCase() + input.slice(1)

const cache: {
  [key: string]: string
} = {}

export default function (value: string) {
  if (cache[value]) {
    return cache[value]
  }

  if (value === null || value === void 0) return ''
  if (typeof value.toString !== 'function') return ''

  let input = value.toString().trim()

  if (input === '') return ''
  if (input.length === 1) return input.toLocaleUpperCase()

  const match = input.match(/[a-zA-Z0-9]+/g)

  if (match) {
    input = match.map(upperFirstLetter).join('')
  }

  cache[value] = input

  return input
}
