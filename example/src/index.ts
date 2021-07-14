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
        oauth_token: 'yrp6AwAAAAABQ_LBAAABeqRWdPs',
        oauth_token_secret: 'Pc3UJjXQEoWp20Qu4egQqeoFVeJq1gVi',
      },
      '0194098'
    )
  )

  const twitter = new Twitter({
    token: '',
    oauthToken: '1178600698847477760-d3rsfIFVPxGzl8hl3kvUtyqXXFRBrP',
    oauthTokenSecret: 'ZaopayaQWTfXnJCiym55lpL8bkTRLcTUeVJXNOoictNaK',
    oauth,
  })

  const response = await twitter
    .post()
    .update({ status: 'twitterAPIから送信test' })

  const json = await response.json()
  console.log(json)
})()
