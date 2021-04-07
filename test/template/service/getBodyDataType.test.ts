import { getBodyDataType } from '../../../src/template/service/getBodyDataType'

describe('getBodyDataType', () => {
  it('type object', () => {
    expect(
      getBodyDataType({
        'content': {
          'application/json': {
            'schema': {
              'type': 'object',
              'properties': {
                'sessionUser': {
                  '$ref': '#/components/schemas/SessionUser',
                },
                'request': {
                  '$ref': '#/components/schemas/UserAddRequest',
                },
              },
            },
          },
        },
        'required': true,
      })
    ).toStrictEqual({
      'bodyType': `data:{sessionUser:SessionUser,request:UserAddRequest,},`,
      'bodyTypeImportsSet': new Set([
        "import { SessionUser } from './interfaces/SessionUser'",
        "import { UserAddRequest } from './interfaces/UserAddRequest'",
      ]),
    })
  })

  it('body directly is schema', () => {
    expect(
      getBodyDataType({
        'content': {
          'application/json': {
            'schema': {
              '$ref': '#/components/schemas/CorporationCreateRequest',
            },
          },
        },
        'required': true,
      })
    ).toStrictEqual({
      'bodyType': 'data:CorporationCreateRequest,',
      'bodyTypeImportsSet': new Set([
        "import { CorporationCreateRequest } from './interfaces/CorporationCreateRequest'",
      ]),
    })
  })
})
