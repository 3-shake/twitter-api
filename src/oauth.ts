import fetch from 'node-fetch'
import OAuth from 'oauth-1.0a'
import * as crypto from 'crypto'
import * as qs from 'querystring'

const createOauthClient = (key: string, secret: string) => {
  const client = new OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64')
    },
  })

  return client
}

export interface OAuthToken {
  oauth_token: string
  oauth_token_secret: string
}

export interface AccessToken extends OAuthToken {
  user_id: string
  screen_name: string
}

export class TwitterOAuth {
  oauth: OAuth

  constructor(consumerKey: string, consumerSecret: string) {
    this.oauth = createOauthClient(consumerKey, consumerSecret)
  }

  async requestToken(callbackURL: string): Promise<OAuthToken> {
    const encodedCallbackURL = encodeURIComponent(callbackURL)
    const requestTokenURL = `https://api.twitter.com/oauth/request_token?oauth_callback=${encodedCallbackURL}`

    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: requestTokenURL,
        method: 'POST',
      })
    )

    const response = await fetch(requestTokenURL, {
      method: 'POST',
      headers: {
        Authorization: authHeader['Authorization'],
      },
    })

    if (response.ok) {
      const params = qs.parse(await response.text())
      return {
        oauth_token: params['oauth_token'] as string,
        oauth_token_secret: params['oauth_token_secret'] as string,
      }
    } else {
      throw new Error(`unexpected response ${response.statusText}`)
    }
  }

  async authorizeURL(oauthToken: OAuthToken): Promise<string> {
    const baseURL = new URL('https://api.twitter.com/oauth/authorize')
    baseURL.searchParams.append('oauth_token', oauthToken.oauth_token)
    baseURL.searchParams.append('force_login', 'true')
    return baseURL.href
  }

  async accessToken(
    oauthToken: OAuthToken,
    verifier: string
  ): Promise<AccessToken> {
    const accessTokenURL = 'https://api.twitter.com/oauth/access_token'
    const authHeader = this.oauth.toHeader(
      this.oauth.authorize({
        url: accessTokenURL,
        method: 'POST',
      })
    )

    const url = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauthToken.oauth_token}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader['Authorization'],
      },
    })

    if (response.ok) {
      const params = qs.parse(await response.text())
      return {
        oauth_token: params['oauth_token'] as string,
        oauth_token_secret: params['oauth_token_secret'] as string,
        user_id: params['user_id'] as string,
        screen_name: params['screen_name'] as string,
      }
    } else {
      throw new Error(`unexpected response ${response.statusText}`)
    }
  }
}
