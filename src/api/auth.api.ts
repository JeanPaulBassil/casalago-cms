import { Tokens } from './models/Tokens'
import { ApiResponse } from './utils'
import { AbstractApi } from './utils/AbstractApi'

export class AuthApi extends AbstractApi<Tokens> {
  readonly path = 'auth'
  constructor(secure = false) {
    super('auth', secure)
  }

  async login(username: string, password: string): Promise<ApiResponse<Tokens>> {
    const response = this.doFetch({
      requestOptions: {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      pathExtension: 'login',
    }) as Promise<ApiResponse<Tokens>>

    return response
  }
}
