import { TwitterOAuth } from '@3-shake/twitter-api'
import * as dotenv from 'dotenv'
dotenv.config()

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env

;(async () => {
  const oauth = new TwitterOAuth(CONSUMER_KEY!, CONSUMER_SECRET!)
  const oauthToken = await oauth.requestToken('http://localhost:3000/talents/')
  console.log(oauthToken)
  console.log(await oauth.authorizeURL(oauthToken))

  //   console.log(
  //     await oauth.accessToken(
  //       {
  //         oauth_token: "DOE0fgAAAAABNZlFAAABej1Eh40",
  //         oauth_token_secret: "tbnBYpLVhY78fBV1pP70MZvz4duFFGba",
  //       },
  //       "3826044"
  //     )
  //   );
})()
