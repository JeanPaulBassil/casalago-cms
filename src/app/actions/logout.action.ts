'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { baseUrl } from '@/api/utils/AbstractApi'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/auth.constants'
import { ServerError } from '@/api/utils'
import { deleteAccessTokenAndRefreshTokenCookies } from '../lib/session'

const logoutAction = async () => {
  const endpoint = baseUrl + 'auth/logout'
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value

  if (!accessToken) {
    redirect('/login')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    await response.json()

    if (!response.ok) {
      throw new ServerError({
        error: {
          message: 'An error occurred while logging out',
          response: 'An error occurred while logging out',
          name: 'Error',
          status: response.status,
        },
        timestamp: new Date().getTime(),
      })
    }

    deleteAccessTokenAndRefreshTokenCookies()
  } catch (error) {
    // If the error is from the backend, it should follow the ResponseError structure
    if (error instanceof ServerError) {
      throw error
    }

    // If the error is not from the backend, we create a similar structure to maintain consistency
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
        message: 'An error occurred while logging out',
        response: 'An error occurred while logging out',
        name: 'Error',
        status: 400,
      },
      timestamp: new Date().getTime(),
    })
  }
}

export default logoutAction
