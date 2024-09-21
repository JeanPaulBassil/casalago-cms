import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { baseUrl } from './api/utils/AbstractApi'
import { Tokens } from './api/models/Tokens'
import { ServerError } from './api/utils'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './app/constants/auth.constants'
import { cookies } from 'next/headers'
import { setAccessTokenCookie, setRefreshTokenCookie, verifyAccessToken } from './app/lib/session'

export const refreshTokensIfPossible = async (refreshToken: string) => {
  console.log('refreshToken', refreshToken)
  const endpoint = baseUrl + 'auth/refresh'
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${refreshToken}`,
      },
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

const deleteTokensAndGoToLogin = (baseUrl: string) => {
  const url = new URL(`/login`, baseUrl)
  console.log('BREAKPOINT 20')
  const response = NextResponse.redirect(url.href)
  response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME)
  response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME)
  return response
}

export async function middleware(request: NextRequest) {
  console.log('BREAKPOINT 1')
  const cookieJar = cookies()
  const accessToken = cookieJar.get(ACCESS_TOKEN_COOKIE_NAME)?.value
  const refreshToken = cookieJar.get(REFRESH_TOKEN_COOKIE_NAME)?.value
  const path = request.nextUrl.pathname

  console.log('BREAKPOINT 2', path)
  const isSigninPath = path.startsWith('/login')
  const isEmptyPath = !path.startsWith('/products') && !path.startsWith('/brands') && !path.startsWith('/users') && !path.startsWith('/categories')

  if (isSigninPath) {
    console.log('BREAKPOINT 3')
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    if (!accessToken && refreshToken) {
      console.log('BREAKPOINT 4')
      try {
        const { newAccessToken, newRefreshToken } = await refreshTokensIfPossible(refreshToken)
        const url = redirectParam ? new URL(redirectParam) : new URL(`/`, request.url)
        const response = NextResponse.redirect(url.href)
        setAccessTokenCookie(newAccessToken, response)
        setRefreshTokenCookie(newRefreshToken, response)
        return response
      } catch (error) {
        console.log('BREAKPOINT 5')
        return deleteTokensAndGoToLogin(request.url)
      }
    }
    console.log('BREAKPOINT 6')
    if (accessToken && refreshToken) {
      console.log('BREAKPOINT 7')
      if (await verifyAccessToken(accessToken)) {
        console.log('BREAKPOINT 8')
        console.log('BREAKPOINT 8.1', redirectParam)
        console.log('BREAKPOINT 8.2', request.url)
        // go to home
        console.log('BREAKPOINT 8.3', new URL('/', request.url))
        const url = redirectParam ? new URL(redirectParam) : new URL('/', request.url)

        console.log('BREAKPOINT 8.1', url.href)
        return NextResponse.redirect(url.href)
      } else {
        console.log('BREAKPOINT 9')
        return deleteTokensAndGoToLogin(request.url)
      }
    }
    console.log('BREAKPOINT 10')
    return NextResponse.next()
  }

  if (isEmptyPath) {
    console.log('BREAKPOINT 11')
    return NextResponse.redirect(new URL('/products', request.url))
  }

  console.log('BREAKPOINT 11')
  if ((!accessToken && !refreshToken) || (accessToken && !refreshToken)) {
    console.log('BREAKPOINT 12')
    const signinUrl = new URL(`/login?redirect=${encodeURIComponent(request.url)}`, request.url)
    return NextResponse.redirect(signinUrl.href)
  }

  if (!accessToken && refreshToken) {
    console.log('BREAKPOINT 13')
    try {
      console.log('BREAKPOINT 14')
      const { newAccessToken, newRefreshToken } = await refreshTokensIfPossible(refreshToken)
      const response = NextResponse.next()
      setAccessTokenCookie(newAccessToken, response)
      setRefreshTokenCookie(newRefreshToken, response)
      return response
    } catch (error) {
      console.log('BREAKPOINT 15')
      return deleteTokensAndGoToLogin(request.url)
    }
  }

  if (accessToken && refreshToken) {
    console.log('BREAKPOINT 16')
    if (await verifyAccessToken(accessToken)) {
      console.log('BREAKPOINT 17')
      return NextResponse.next()
    } else {
      console.log('BREAKPOINT 18')
      return deleteTokensAndGoToLogin(request.url)
    }
  }

  console.log('BREAKPOINT 19')
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)'],
}
