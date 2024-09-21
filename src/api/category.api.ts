import { Category, CreateCategory } from './models/Category'
import { Tokens } from './models/Tokens'
import { CreateUser, User } from './models/User'
import { ApiResponse } from './utils'
import { AbstractApi, ApiRequestParams } from './utils/AbstractApi'

export class CategoryApi extends AbstractApi<Category> {
  readonly path = 'categories'
  constructor() {
    super('categories')
  }

  async create(category: CreateCategory): Promise<ApiResponse<Category>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'POST',
        body: JSON.stringify(category),
      },
    }) as Promise<ApiResponse<Category>>
    return response
  }

  public async getCategories(params: ApiRequestParams): Promise<ApiResponse<Category[]>> {
    const response = (await this.doFetch({
      queries: params.queries,
      requestOptions: {
        method: 'GET',
      },
    })) as ApiResponse<Category[]>

    return response
  }

  public async delete(id: string): Promise<ApiResponse<Category>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'DELETE',
      },
      pathExtension: id,
    })) as ApiResponse<Category>
    return response
  }
}
