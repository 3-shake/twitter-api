import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'

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

    const path = `/2/users/${this.id}/followers`
    const params = new URLSearchParams(options as {})

    return fetch(`${this.apiEndpoint}${path}?` + params, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
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

    const path = `/2/users/${this.id}/following`
    const params = new URLSearchParams(options as {})

    return fetch(`${this.apiEndpoint}${path}?` + params, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
      },
    })
  }

  following(payload: FollowingRequest): Promise<FollowingResponse> {
    const path = `/2/users/${this.id}/following`
    return fetch(`${this.apiEndpoint}${path}?`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
      },
    })
  }

  unfollow(targetId: string): Promise<UnfollowingResponse> {
    const path = `/2/users/${this.id}/following/${targetId}`
    return fetch(`${this.apiEndpoint}${path}?`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
      },
    })
  }
}
