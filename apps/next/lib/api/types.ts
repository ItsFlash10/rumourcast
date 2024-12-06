export type ApiResponse<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: {
        message: string
        status: number
      }
    }

export type RequestConfig = {
  authenticated?: boolean
  headers?: Record<string, string>
  isFormData?: boolean
} & Omit<RequestInit, 'headers'>

export type ERC1155Property = {
  name?: string
  value: string | number | object | (string | number | object)[]
  display_value?: string
  class?: string
  css?: {
    color?: string
    'font-weight'?: string
    'text-decoration'?: string
    [key: string]: string | undefined
  }
}

export type ERC1155Metadata = {
  name: string
  decimals?: number
  description: string
  image: string
  properties?: {
    [key: string]: string | number | ERC1155Property
  }
  localization?: {
    uri: string
    default: string
    locales: string[]
  }
}

export type ERC1155MetadataGenerator = {
  generateMetadata: (id: string) => ERC1155Metadata
}
