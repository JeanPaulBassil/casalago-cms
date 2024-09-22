export type CreateBrand = {
  name: string
  url: string
  description: string
  image?: string
}

export type Brand = {
  id: string
  name: string
  url: string
  description: string
  image?: string
}

export type UpdateBrand = {
  id: string
  name: string
  url: string
  description: string
  image?: string
}