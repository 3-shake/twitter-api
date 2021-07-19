import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'
import {
  Expansions,
  MediaFields,
  PollFields,
  TweetFields,
  UserFields,
} from './type'

export interface ListTweetsResponse extends Response {
  json(): Promise<{
    data: TweetMetadata[]
  }>
}

export interface GetTweetsResponse extends Response {
  json(): Promise<{
    data: TweetMetadata
  }>
}

interface TweetsRequest {
  expansions?: Expansions

  'media.fields'?: MediaFields

  'poll.fields'?: PollFields
  'tweet.fields'?: TweetFields

  'user.fields'?: UserFields
}

export interface ListTweetsRequest extends TweetsRequest {
  ids: string[] | string
}

export interface GetTweetsRequest extends TweetsRequest {}

export type TweetMetadata = {
  id: string
  text: string

  // format ISO 8601
  created_at: string

  author_id: string

  conversation_id: string

  in_reply_to_user_id: string

  referenced_tweets: {
    type: 'retweeted' | 'quoted' | 'replied_to'
    id: string
  }[]

  attachments: {
    media_keys: string[]
    poll_ids: string[]
  }

  geo: {
    coordinates: {
      type: string
      coordinates: [number, number] | null
    }
    place_id: string
  }

  context_annotations: {
    domain: {
      id: string
      name: string
      description: string
    }
    entity: {
      id: string
      name: string
      description: string
    }
  }

  entities: {
    annotations: {
      start: number
      end: number
      probability: number
      type: string
      normalized_text: string
      urls: {
        start: number
        end: number
        expanded_url: string
        display_url: string
      }[]
    }[]
  }

  hashtags: {
    start: number
    end: number
    tag: string
  }[]

  mentions: {
    start: number
    end: number
    username: string
  }[]

  cashtags: {
    start: number
    end: number
    tag: string
  }[]

  withheld: {
    copyright: boolean
    scope: 'tweet' | 'user'
  }

  public_metrics: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }

  non_public_metrics: {
    impression_count: number
    url_link_clicks: number
    user_profile_clicks: number
  }

  organic_metrics: {
    impression_count: number
    url_link_clicks: number
    user_profile_clicks: number
    retweet_count: number
    reply_count: number
    like_count: number
  }

  promoted_metrics: {
    impression_count: number
    url_link_clicks: number
    user_profile_clicks: number
    retweet_count: number
    reply_count: number
    like_count: number
  }

  possibly_sensitive: boolean

  lang: string

  reply_settings: string

  source: string

  includes: {
    tweets: any[]
    users: any[]
    places: any[]
    media: any[]
    polls: string
  }

  errors: any
}

export class Tweet extends ServiceObject {
  twitter: Twitter

  constructor(twitter: Twitter) {
    const config = {
      baseUrl: '/2/tweets',
    }

    super(config)

    this.twitter = twitter
  }

  list(options: ListTweetsRequest): Promise<ListTweetsResponse> {
    const path = '/2/tweets'
    const method = 'GET'
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

  get(id: string, options: GetTweetsRequest): Promise<GetTweetsResponse> {
    const path = `/2/tweets/${id}`
    const method = 'GET'
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
