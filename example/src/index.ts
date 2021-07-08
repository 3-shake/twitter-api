import { Twitter, TwitterOAuth } from '@3-shake/twitter-api'
import * as dotenv from 'dotenv'
dotenv.config()

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env
;(async () => {
  const oauth = new TwitterOAuth(CONSUMER_KEY!, CONSUMER_SECRET!)
  const oauthToken = await oauth.requestToken('oob')
  console.log(oauthToken)
  console.log(await oauth.authorizeURL(oauthToken))

  // console.log(
  //   await oauth.accessToken(
  //     {
  //       oauth_token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
  //       oauth_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  //     },
  //     '2273904'
  //   )
  // )

  const twitter = new Twitter({
    token: '',
    oauthToken: 'dddddddddddddddddddddddddddddddddddddddddddddddddd',
    oauthTokenSecret: 'ddddddddddddddddddddddddddddddddddddddddddddd',
    oauth,
  })
  const response = await twitter.tweet().list({
    ids: '1278747501642657792,1255542774432063488', // Edit Tweet IDs to look up
    'tweet.fields': 'author_id', // Edit optional query parameters here
    'user.fields': 'created_at', // Edit optional query parameters here
  })
  const json = await response.json()
  console.log(json)
})()
