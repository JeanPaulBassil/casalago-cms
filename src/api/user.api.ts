import { Tokens } from './models/Tokens'
import { CreateUser, User } from './models/User'
import { ApiResponse } from './utils'
import { AbstractApi, ApiRequestParams } from './utils/AbstractApi'

export class UserApi extends AbstractApi<User> {
  readonly path = 'users'
  constructor() {
    super('users')
  }

  async create(user: CreateUser): Promise<ApiResponse<User>> {
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
    const response = (await this.doFetch({
      queries: params.queries,
      requestOptions: {
        method: 'GET',
      },
    })) as ApiResponse<User[]>


    return response
  }

  public async deleteUser(id: string): Promise<ApiResponse<User>> {
    const response = (await this.doFetch({
      requestOptions: {
        method: 'DELETE',
      },
      pathExtension: id,
    })) as ApiResponse<User>

    return response
  }
}
