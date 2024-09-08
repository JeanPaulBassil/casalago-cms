import { Brand } from './models/Brand'
import { CreateProduct, Product, UpdateProduct } from './models/Product'
import { ApiResponse } from './utils'
import { AbstractApi, ApiRequestParams } from './utils/AbstractApi'

export class ProductApi extends AbstractApi<Product> {
  readonly path = 'products'
  constructor() {
    super('products')
  }

  async create(product: CreateProduct): Promise<ApiResponse<Product | string>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'POST',
        body: JSON.stringify(product),
      },
    }) as Promise<ApiResponse<Product>>
    return response
  }

  async getProducts(params: ApiRequestParams): Promise<ApiResponse<Product[]>> {
    const response = (await this.doFetch({
      queries: params.queries,
      requestOptions: {
        method: 'GET',
      },
    })) as ApiResponse<Product[]>
    return response
  }

  async delete(id: string): Promise<ApiResponse<Product>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'DELETE',
      },
      pathExtension: id,
    })) as ApiResponse<Product>
    return response
  }

  async update(id: string, product: UpdateProduct): Promise<ApiResponse<Product>> {
    console.log('product', product) 
    const response = (await this.doFetch({
      requestOptions: {
        method: 'PUT',
        body: JSON.stringify(product),
      },
      pathExtension: id,
    })) as ApiResponse<Product>
    console.log('response', response)
    return response
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'GET',
      },
      pathExtension: id,
    })) as ApiResponse<Product>
    return response
  }

  async getAllCategories(): Promise<ApiResponse<string[]>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'GET',
      },
      pathExtension: 'categories',
    })) as unknown as ApiResponse<string[]>
    return response
  }
}
