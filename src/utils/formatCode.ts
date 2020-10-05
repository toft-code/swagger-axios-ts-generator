import prettier from 'prettier'

export default function formatCode(
  codeString: string,
  prettierConfig: any = {}
): string {
  return prettier.format(codeString, {
    printWidth: 120,
    tabWidth: 2,
    parser: 'typescript',
    trailingComma: 'none',
    jsxBracketSameLine: false,
    semi: false,
    singleQuote: true,
    ...prettierConfig,
  })
}
