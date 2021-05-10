import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'
import { TweetMetadata } from './tweet'

export interface SearchResponse extends Response {
  json(): Promise<{
    data: TweetMetadata[]
    meta: Meta
  }>
}

export interface SearchRequest extends Pagination {
  query?: string

  start_time?: string

  end_time?: string

  since_id?: string

  until_id?: string

  max_results?: number

  expansions?: Expansions

  'media.fields'?: MediaFields

  'place.fields'?: PlaceFields

  'poll.fields'?: PollFields

  'tweet.fields'?: TweetFields

  'user.fields'?: UserFields
}

export class Search extends ServiceObject {
  twitter: Twitter

  constructor(twitter: Twitter) {
    const config = {}

    super(config)

    this.twitter = twitter
  }

  recent(options: SearchRequest): Promise<SearchResponse> {
    delete options.pagination

    const path = '/2/tweets/search/recent'
    const params = new URLSearchParams(options as {})

    return fetch(`${this.apiEndpoint}${path}?` + params, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.twitter.token}`,
      },
    })
  }
}
