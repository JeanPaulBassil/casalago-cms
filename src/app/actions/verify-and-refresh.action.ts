'use server'
import 'server-only'

import { refreshTokensIfPossible } from '@/middleware'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../constants/auth.constants'
import { setAccessTokenCookie, setRefreshTokenCookie } from '../lib/session'

const key = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)

const getAccessTokenVerifiedOrRefreshIfNeeded = async () => {
  console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 1')
  const cookieJar = cookies()
  const accessToken = cookieJar.get(ACCESS_TOKEN_COOKIE_NAME)?.value
  const refreshToken = cookieJar.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 2')

  if (!accessToken && !refreshToken) {
    console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 3')
    return undefined
  }

  if (!accessToken && refreshToken) {
    try {
      console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 4')
      const { newAccessToken, newRefreshToken } = await refreshTokensIfPossible(refreshToken)
      setAccessTokenCookie(newAccessToken)
      setRefreshTokenCookie(newRefreshToken)

      return newAccessToken
    } catch (error) {
      console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 5')
      return undefined
    }
  }

  if (accessToken && refreshToken) {
    console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 7')
    const isAccessTokenValid = await jwtVerify(accessToken, key, { algorithms: ['HS256'] })
    

    if (isAccessTokenValid) {
      console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 6')
      return accessToken
    }

    try {
      console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 8')
      const { newAccessToken, newRefreshToken } = await refreshTokensIfPossible(refreshToken)
      setAccessTokenCookie(newAccessToken)
      setRefreshTokenCookie(newRefreshToken)

      return newAccessToken
    } catch (error) {
      console.warn('getAccessTokenVerifiedOrRefreshIfNeeded BREAKPOINT 9')
      return undefined
    }
  }

  return undefined
}

export default getAccessTokenVerifiedOrRefreshIfNeeded
