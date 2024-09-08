import { Brand } from "./Brand"

export type CreateProduct = {
  name: string
  description: string
  brandId: string
  price: number
  category: string
  tags: string[]
  images: string[]
}

export type UpdateProduct = {
  name: string
  description: string
  brandId: string
  price: number
  category: string
  tags: string[]
  images: string[]
}

export type Product = {
  id: string
  name: string
  description: string
  images: string[]
  brandId: string
  brand: Brand
  price: number
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
