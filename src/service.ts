import { Response } from 'node-fetch'
import { Pagination } from './type'
import { TwitterOAuth } from './oauth'

export interface ServiceConfig {}

export interface ServiceOptions {
  token: string
  oauthToken: string
  oauthTokenSecret: string
  oauth: TwitterOAuth
  timeout?: number // http.request.options.timeout
}

export interface ServiceObjectConfig {}

export class Service {
  token: string
  oauthToken: string
  oauthTokenSecret: string
  oauth: TwitterOAuth
  timeout?: number

  constructor(_: ServiceConfig, options: ServiceOptions) {
    this.token = options.token
    this.oauthToken = options.oauthToken
    this.oauthTokenSecret = options.oauthTokenSecret
    this.oauth = options.oauth
    this.timeout = options.timeout
  }

  makeRequest(url: string, method: string) {
    this.oauth.authorization(url, method, {
      key: this.oauthToken,
      secret: this.oauthTokenSecret,
    })
  }
}

type Method<T, R> = (options: T) => Promise<R>

type Callback<R> = (res: R) => void

export class ServiceObject {
  apiEndpoint: string

  constructor(_: ServiceObjectConfig) {
    this.apiEndpoint = 'https://api.twitter.com'
  }

  pagination<T extends Pagination, R extends Response>(
    options: T,
    method: Method<T, R>,
    callback: Callback<R>,
    maxPage: number = 10
  ): Promise<void> {
    options.pagination = true

    const it = this.iterator(options, method, callback, maxPage)[
      Symbol.asyncIterator
    ]() as AsyncIterableIterator<any>

    return this.doPagination(it, options, method, callback)
  }

  doPagination<T extends Pagination, R extends Response>(
    iterator: AsyncIterableIterator<any>,
    options: T,
    method: Method<T, R>,
    callback: Callback<R>
  ): Promise<void> {
    return iterator.next().then((result) => {
      if (result.done) {
        return
      }

      return this.doPagination(iterator, options, method, callback)
    })
  }

  iterator<T extends Pagination, R extends Response>(
    options: T,
    method: Method<T, R>,
    callback: Callback<R>,
    maxPage: number = 10
  ) {
    let self = this

    let next_token = 'init'
    let index = 0

    let reqOptions = options

    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!next_token || index === maxPage) {
            return { done: true }
          }

          const response = await method.call(self, reqOptions)
          const json = await response.json()

          callback.call(self, json)

          reqOptions.next_token = json.meta.next_token

          index++

          return { value: json }
        },
      }),
    }
  }
}
