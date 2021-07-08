import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'
import { TweetMetadata } from './tweet'
import {
  Expansions,
  MediaFields,
  Meta,
  Pagination,
  PlaceFields,
  PollFields,
  TweetFields,
  UserFields,
} from './type'

export interface ListTimelineTweetsResponse extends Response {
  json(): Promise<{
    data: TweetMetadata[]
    meta: Meta
  }>
}

export interface ListTimelineMentionsResponse extends Response {
  json(): Promise<{
    data: TweetMetadata
    meta: Meta
  }>
}

interface TimelineRequest {
  start_time?: string

  end_time?: string

  expansions?: Expansions

  max_results?: number

  pagination_token?: string

  since_id?: string

  until_id?: string

  'media.fields'?: MediaFields

  'place.fields'?: PlaceFields

  'poll.fields'?: PollFields

  'tweet.fields'?: TweetFields

  'user.fields'?: UserFields
}

export interface ListTimelineTweetsRequest
  extends TimelineRequest,
    Pagination {}

export interface GetTimelineMentionsRequest
  extends TimelineRequest,
    Pagination {}

// type GetOrCreateOptions = GetConfig & CreateOptions

export class Timeline extends ServiceObject {
  twitter: Twitter
  id: string

  constructor(twitter: Twitter, id: string) {
    const config = {}

    super(config)

    this.twitter = twitter
    this.id = id
  }

  tweets(
    options: ListTimelineTweetsRequest
  ): Promise<ListTimelineTweetsResponse> {
    if (options.pagination) {
      options.pagination_token = options.next_token
      if (!options.pagination_token) {
        delete options.pagination_token
      }
    }
    delete options.pagination
    delete options.next_token

    const path = `/2/users/${this.id}/tweets`
    const method = 'GET'
    const params = new URLSearchParams(options as {})
    const url = `${this.apiEndpoint}${path}?` + params
    const authHeader = this.twitter.oauth.authorization(url, method, {
      key: this.twitter.oauthToken,
      secret: this.twitter.oauthTokenSecret,
    })

    return fetch(url, {
      method: 'GET',
      headers: {
        authorization: authHeader['Authorization'],
      },
    })
  }

  mentions(
    options: GetTimelineMentionsRequest
  ): Promise<ListTimelineMentionsResponse> {
    if (options.pagination) {
      options.pagination_token = options.next_token
      if (!options.pagination_token) {
        delete options.pagination_token
      }
    }
    delete options.pagination
    delete options.next_token

    const method = 'GET'
    const path = `/2/users/${this.id}/mentions`
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
}
