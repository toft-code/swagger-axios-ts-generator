export interface SwaggerConfigType {
  openapi: string
  info: Info
  servers: Server[]
  tags: Tag[]
  paths: Paths
  components: Components
}

export interface Paths {
  // todo
}

export interface Components {
  // schemas: Schemas
  // todo
}

export interface Tag {
  name: string
  description: string
}

export interface Server {
  url: string
  description: string
}

export interface Info {
  title: string
  version: string
}
