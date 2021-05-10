# Twitter API


## Example

```
import { Twitter } from './twitter'
import * as dotenv from 'dotenv'
import { SearchRequest, SearchResponse } from './search'
import {
  ListTimelineTweetsRequest,
  ListTimelineTweetsResponse,
} from './timeline'
dotenv.config()

const TOKEN = process.env.TWITTER_API_TOKEN!
console.log(TOKEN)

const listTweets = async () => {
  const twitter = new Twitter({ token: TOKEN })
  const response = await twitter.tweet().list({
    ids: '1278747501642657792,1255542774432063488', // Edit Tweet IDs to look up
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json.data[0])
}

listTweets()

const getTweet = async () => {
  const twitter = new Twitter({ token: TOKEN })
  const response = await twitter.tweet().get('1278747501642657792', {
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json.data)
}

getTweet()

const timelineTweets = async () => {
  const twitter = new Twitter({ token: TOKEN })
  await twitter
    .timeline('2244994945')
    .pagination<ListTimelineTweetsRequest, ListTimelineTweetsResponse>(
      {
        'tweet.fields': 'author_id', // Edit optional query parameters here
        'user.fields': 'created_at', // Edit optional query parameters here
      },
      twitter.timeline('2244994945').tweets,
      (res) => {
        console.log('res->', res)
      }
    )
}

timelineTweets()

const timelineMentions = async () => {
  const twitter = new Twitter({ token: TOKEN })
  const response = await twitter.timeline('2244994945').mentions(, {
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json.data)
}

timelineMentions()

const search = async () => {
  const twitter = new Twitter({ token: TOKEN })
  await twitter.search().pagination<SearchRequest, SearchResponse>(
    { query: 'python' },
    twitter.search().recent,
    (res) => {
      console.log('res->', res)
    },
    5
  )
}

search()

const listFollowers = async () => {
  const twitter = new Twitter({ token: TOKEN })
  const response = await twitter.follow('2244994945').listFollowers({
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json.data)
}

listFollowers()

const listFollowing = async () => {
  const twitter = new Twitter({ token: TOKEN })
  const response = await twitter.follow('2244994945').listFollowing({
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json.data)
}

listFollowing()

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env

;(async () => {
  const oauth = new TwitterOAuth(CONSUMER_KEY!, CONSUMER_SECRET!)
  const oauthToken = await oauth.requestToken('oob')
  console.log(oauthToken)
  console.log(await oauth.authorizeURL(oauthToken))

  console.log(
    await oauth.accessToken(
      {
        oauth_token: 'b4X7kAAAAAABNZlFAAABeB0xm74',
        oauth_token_secret: '0UNkiZSyEGXnKAU5g6JAdnYbovPNcaxd',
      },
      '6984823'
    )
  )
})()
```
