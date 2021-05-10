import { Service, ServiceOptions } from './service'
import { Tweet } from './tweet'
import { Follow } from './follow'
import { Timeline } from './timeline'
import { Search } from './search'

export interface TwitterOptions extends ServiceOptions {}

export class Twitter extends Service {
  static Follow: typeof Follow = Follow

  static Search: typeof Search = Search

  static Timeline: typeof Timeline = Timeline

  static Tweet: typeof Tweet = Tweet

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
}
