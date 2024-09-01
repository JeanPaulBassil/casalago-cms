import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { baseUrl } from './api/utils/AbstractApi'
import { Tokens } from './api/models/Tokens'
import { ServerError } from './api/utils'

export const refreshTokensIfPossible = async (refreshToken: string) => {
  console.log('refreshToken', refreshToken)
  const endpoint = baseUrl + 'auth/refresh'
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
      cache: 'no-store',
    })
    const body = await response.json()
    const payload = body.payload as Tokens

    console.log('body', body)

    const newAccessToken = payload.access_token
    const newRefreshToken = payload.refresh_token

    if (!response.ok || !newAccessToken || !newRefreshToken) {
      throw new Error()
    }
    return { newAccessToken, newRefreshToken }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error
    }
    if (error instanceof Error) {
      throw new ServerError({
        error: {
          message: error.message,
          name: error.name,
          response: error.message,
          status: error.name === 'TypeError' ? 500 : 400,
        },
        timestamp: new Date().getTime(),
      })
    }
    throw new ServerError({
      error: {
        message: 'An error occurred while fetching data',
        name: 'Error',
        response: 'An error occurred while fetching data',
        status: 400,
      },
      timestamp: new Date().getTime(),
    })
  }
}

export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)'],
}
