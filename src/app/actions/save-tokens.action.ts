'use server'

import { setAccessTokenCookie, setRefreshTokenCookie } from "../lib/session"


const saveTokensAction = async (accessToken: string, refreshToken?: string) => {
  await setAccessTokenCookie(accessToken)
  if (refreshToken) {
    await setRefreshTokenCookie(refreshToken)
  }
}

export default saveTokensAction
