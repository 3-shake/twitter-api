import fetch, { Response } from 'node-fetch'
import { ServiceObject } from './service'
import { Twitter } from './twitter'

export interface updateTweetsResponse extends Response {
  json(): Promise<{
    data: statusTweetMetadata[]
  }>
}

export interface PostTweetsRequest {
  status: string
}

export type statusTweetMetadata = {
  created_at: string
  id: number
  id_str: string
  text: string
  truncated: boolean
  entities: { hashtags: []; symbols: []; user_mentions: []; urls: [] }
  source: string
  in_reply_to_status_id: any
  in_reply_to_status_id_str: any
  in_reply_to_user_id: any
  in_reply_to_user_id_str: any
  in_reply_to_screen_name: any
  user: {
    id: number
    id_str: string
    name: string
    screen_name: string
    location: string
    description: string
    url: string
    entities: { url: [Object]; description: [Object] }
    protected: boolean
    followers_count: number
    friends_count: number
    listed_count: number
    created_at: string
    favourites_count: number
    utc_offset: any
    time_zone: any
    geo_enabled: boolean
    verified: boolean
    statuses_count: number
    lang: null
    contributors_enabled: boolean
    is_translator: boolean
    is_translation_enabled: boolean
    profile_background_color: string
    profile_background_image_url: null
    profile_background_image_url_https: null
    profile_background_tile: boolean
    profile_image_url: string
    profile_image_url_https: string
    profile_banner_url: string
    profile_link_color: string
    profile_sidebar_border_color: string
    profile_sidebar_fill_color: string
    profile_text_color: string
    profile_use_background_image: boolean
    has_extended_profile: boolean
    default_profile: boolean
    default_profile_image: boolean
    following: boolean
    follow_request_sent: boolean
    notifications: boolean
    translator_type: string
    withheld_in_countries: []
  }
  geo: any
  coordinates: any
  place: any
  contributors: any
  is_quote_status: boolean
  retweet_count: string
  favorite_count: string
  favorited: boolean
  retweeted: boolean
  lang: string
}

export class Statuses extends ServiceObject {
  twitter: Twitter
  constructor(twitter: Twitter) {
    const config = {
      baseUrl: 'statuses/update',
    }
    super(config)
    this.twitter = twitter
  }

  update(tweet: PostTweetsRequest): Promise<updateTweetsResponse> {
    const path = '/1.1/statuses/update.json'
    const method = 'POST'
    const params = new URLSearchParams(tweet as {})
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
