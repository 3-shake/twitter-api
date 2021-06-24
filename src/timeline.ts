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
    const params = new URLSearchParams(options as {})

    console.log(`${this.apiEndpoint}${path}?${params}`)
    return fetch(`${this.apiEndpoint}${path}?` + params, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
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

    const path = `/2/users/${this.id}/mentions`
    const params = new URLSearchParams(options as {})

    return fetch(`${this.apiEndpoint}${path}?` + params, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
      },
    })
  }
}
