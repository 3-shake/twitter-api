import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'
import { Expansions, Meta, Pagination, TweetFields, UserFields } from './type'

export interface ListFollowersResponse extends Response {
  json(): Promise<{
    data: FollowResponse[]
    meta: Meta
  }>
}

export interface ListFollowingResponse extends Response {
  json(): Promise<{
    data: FollowResponse[]
    meta: Meta
  }>
}

interface FollowResponse {
  id: string

  name: string

  username: string

  created_at?: string

  protected?: boolean

  withheld?: {
    country_codes: string[]
    scope: 'tweet' | 'user'
  }

  location?: string

  url?: string

  description?: string

  verified?: boolean

  entities?: {
    url: {
      urls: {
        start: number
        end: number
        url: string
        expanded_url: string
        display_url: string
      }[]
    }[]

    description: {
      urls: {
        start: number
        end: number
        url: string
        expanded_url: string
        display_url: string
      }[]

      hashtags: {
        start: number
        end: number
        hashtag: string
      }[]

      mentions: {
        start: number
        end: number
        username: string
      }[]

      cashtags: {
        start: number
        end: number
        cashtag: string
      }[]
    }[]
  }

  public_metrics?: {
    followers_count: number

    following_count: number

    tweet_count: number

    listed_count: number
  }

  pinned_tweet_id: string

  'includes.tweets': any[]

  errors: any[]
}

interface FollowRequest {
  expansions?: Expansions

  max_results?: number

  pagination_token?: string

  'tweet.fields'?: TweetFields

  'user.fields'?: UserFields
}

export interface ListFollowersRequest extends FollowRequest, Pagination {}

export interface ListFollowingRequest extends FollowRequest, Pagination {}

export interface FollowingRequest {
  target_user_id: string
}

export interface FollowingResponse extends Response {
  json(): Promise<{
    data: {
      following: boolean
      pending_follow: boolean
    }
  }>
}

export interface UnfollowingResponse extends Response {
  json(): Promise<{
    data: {
      following: boolean
    }
  }>
}
// type GetOrCreateOptions = GetConfig & CreateOptions

export class Follow extends ServiceObject {
  twitter: Twitter
  id: string

  constructor(twitter: Twitter, id: string) {
    const config = {}

    super(config)

    this.twitter = twitter
    this.id = id
  }

  listFollowers(options: ListFollowersRequest): Promise<ListFollowersResponse> {
    if (options.pagination) {
      options.pagination_token = options.next_token
      if (!options.pagination_token) {
        delete options.pagination_token
      }
    }
    delete options.pagination
    delete options.next_token

    const method = 'GET'
    const path = `/2/users/${this.id}/followers`
    const params = new URLSearchParams(options as {})
    const url = `${this.apiEndpoint}${path}?` + params
    const authHeader = this.twitter.oauth.authorization(url, method, {
      key: this.twitter.oauthToken,
      secret: this.twitter.oauthTokenSecret,
    })

    return fetch(url + params, {
      method,
      headers: {
        authorization: authHeader['Authorization'],
      },
    })
  }

  listFollowing(options: ListFollowingRequest): Promise<ListFollowingResponse> {
    if (options.pagination) {
      options.pagination_token = options.next_token
      if (!options.pagination_token) {
        delete options.pagination_token
      }
    }
    delete options.pagination
    delete options.next_token

    const method = 'GET'
    const path = `/2/users/${this.id}/following`
    const params = new URLSearchParams(options as {})
    const url = `${this.apiEndpoint}${path}?` + params
    const authHeader = this.twitter.oauth.authorization(url, method, {
      key: this.twitter.oauthToken,
      secret: this.twitter.oauthTokenSecret,
    })

    return fetch(url, {
      method: method,
      headers: {
        authorization: authHeader['Authorization'],
      },
    })
  }

  following(payload: FollowingRequest): Promise<FollowingResponse> {
    const method = 'POST'
    const path = `/2/users/${this.id}/following`
    const url = `${this.apiEndpoint}${path}?`
    const authHeader = this.twitter.oauth.authorization(url, method, {
      key: this.twitter.oauthToken,
      secret: this.twitter.oauthTokenSecret,
    })
    return fetch(url, {
      method: method,
      body: JSON.stringify(payload),
      headers: {
        authorization: authHeader['Authorization'],
      },
    })
  }

  unfollow(targetId: string): Promise<UnfollowingResponse> {
    const method = 'DELETE'
    const path = `/2/users/${this.id}/following/${targetId}`
    const url = `${this.apiEndpoint}${path}?`
    const authHeader = this.twitter.oauth.authorization(url, method, {
      key: this.twitter.oauthToken,
      secret: this.twitter.oauthTokenSecret,
    })

    return fetch(url, {
      method: method,
      headers: {
        authorization: authHeader['Authorization'],
      },
    })
  }
}
