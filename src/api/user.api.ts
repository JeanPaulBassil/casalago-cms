import { Tokens } from './models/Tokens'
import { User } from './models/User'
import { ApiResponse } from './utils'
import { AbstractApi, ApiRequestParams } from './utils/AbstractApi'

export class UserApi extends AbstractApi<User> {
  readonly path = 'users'
  constructor() {
    super('users')
  }

  async create(user: User): Promise<ApiResponse<User>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'POST',
        body: JSON.stringify(user),
      },
      pathExtension: 'create',
    }) as Promise<ApiResponse<User>>

    return response
  }

  public async getUsers(params: ApiRequestParams): Promise<ApiResponse<User[]>> {
    console.log('params', params)
    const response = await this.doFetch({
      queries: params.queries,
      requestOptions: {
        method: 'GET',
      },
    }) as ApiResponse<User[]>

    console.log('response', response)

    return response
  }
}
