import { Brand, CreateBrand, UpdateBrand } from './models/Brand'
import { Tokens } from './models/Tokens'
import { CreateUser, User } from './models/User'
import { ApiResponse } from './utils'
import { AbstractApi, ApiRequestParams } from './utils/AbstractApi'

export class BrandApi extends AbstractApi<Brand> {
  readonly path = 'brands'
  constructor() {
    super('brands')
  }

  async create(brand: CreateBrand): Promise<ApiResponse<Brand>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'POST',
        body: JSON.stringify(brand),
      },
    }) as Promise<ApiResponse<Brand>>
    return response
  }

  async update(brand: UpdateBrand): Promise<ApiResponse<Brand>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'PUT',
        body: JSON.stringify(brand),
      },
    }) as Promise<ApiResponse<Brand>>
    return response
  }

  public async getBrands(params: ApiRequestParams): Promise<ApiResponse<Brand[]>> {
    const response = (await this.doFetch({
      queries: params.queries,
      requestOptions: {
        method: 'GET',
      },
    })) as ApiResponse<Brand[]>

    return response
  }

  public async delete(id: string): Promise<ApiResponse<Brand>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'DELETE',
      },
      pathExtension: id,
    })) as ApiResponse<Brand>
    return response
  }
}
