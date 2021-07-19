import { TwitterOAuth, Twitter } from '@3-shake/twitter-api'
import * as dotenv from 'dotenv'
dotenv.config()

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env
;(async () => {
  const oauth = new TwitterOAuth(CONSUMER_KEY!, CONSUMER_SECRET!)
  const oauthToken = await oauth.requestToken('oob')
  console.log(oauthToken)
  console.log(await oauth.authorizeURL(oauthToken))

  console.log(
    await oauth.accessToken(
      {
        oauth_token: 'XXXXXXXXXX',
        oauth_token_secret: 'XXXXXXXXXX',
      },
      'XXXXXXXXXX'
    )
  )

  const twitter = new Twitter({
    token: '',
    oauthToken: 'XXXXXXXXXX-XXXXXXXXXX',
    oauthTokenSecret: 'XXXXXXXXXX',
    oauth,
  })

  const response = await twitter
    .statuses()
    .update({ status: `XXXXXX\n` + 'XXXXXXXXX' })

  const json = await response.json()
  console.log(json)
})()
