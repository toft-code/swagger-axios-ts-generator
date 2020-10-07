import { IDefinitionProperty, ISchema } from '../type/SwaggerConfigType'
import pascalCase from './pascalCase'
import { refName } from './refName'
import toTypescriptType from './toTypescriptType'

export function getPropertyInfo(
  propertyName: string,
  property: IDefinitionProperty
): {
  type: string
  isEnum: boolean
  enumValue: string
  isArray: boolean
  isType: boolean
  ref: string
} {
  const result = {
    type: '',
    isEnum: false,
    enumValue: '',
    isArray: false,
    /**ts type definition */
    isType: false,
    ref: '',
  }

  propertyName = pascalCase(propertyName)

  // ref
  if (property.$ref || (property.allOf && property.allOf[0])) {
    result.type = refName(property.$ref || property.allOf[0].$ref)
    result.ref = result.type
  }

  // array
  else if (property.items) {
    if (
      property.items.$ref ||
      (property.items.allOf && property.items.allOf[0])
    ) {
      result.ref = refName(property.items.$ref || property.items.allOf[0].$ref)
      result.type = result.ref + '[]'
    } else {
      if (property.items.type === 'array' || !!property.items.enum) {
        const currentResult = getPropertyInfo(propertyName, property.items)
        Object.assign(result, currentResult)
      } else {
        result.type =
          toTypescriptType(property.items.type, property.items.format) + '[]'
      }
    }
    result.isArray = true
  }

  // enum string
  else if (property.enum) {
    result.isEnum = true
    result.type = 'Enum' + propertyName
    result.ref = 'Enum' + propertyName
    result.enumValue =
      property.type === 'string'
        ? getEnums(property.enum)
            .map((item) => {
              const key = item[0].match(/[a-z]/i) ? item : 'NUM' + item
              return `'${key}'='${item}'`
            })
            .join(',')
        : property.enum.join('|')
  }

  // base
  else {
    result.type = toTypescriptType(property.type, property.format)
  }

  return result
}

function getEnums(enumObject: any): any[] {
  return Object.prototype.toString.call(enumObject) === '[object Object]'
    ? Object.values(enumObject)
    : enumObject
}
