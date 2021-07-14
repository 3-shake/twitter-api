import { Service } from './service'
import { TwitterOAuth } from './oauth'
import { Tweet } from './tweet'
import { Follow } from './follow'
import { Timeline } from './timeline'
import { Search } from './search'
import { Statuses } from './statuses'
export interface TwitterOptions {
  token: string
  oauthToken: string
  oauthTokenSecret: string
  oauth: TwitterOAuth
}

export class Twitter extends Service {
  static Follow: typeof Follow = Follow

  static Search: typeof Search = Search

  static Timeline: typeof Timeline = Timeline

  static Tweet: typeof Tweet = Tweet
  static Statuses: typeof Statuses = Statuses
  constructor(options: TwitterOptions) {
    super({}, options)
  }

  follow(id: string): Follow {
    return new Follow(this, id)
  }

  search(): Search {
    return new Search(this)
  }

  timeline(id: string): Timeline {
    return new Timeline(this, id)
  }

  tweet(): Tweet {
    return new Tweet(this)
  }
  statuses(): Statuses {
    return new Statuses(this)
  }
}
