export class HttpError extends Error {
  public readonly statusCode: number
  public readonly body: string

  constructor (statusCode: number, body: object) {
    super()
    this.statusCode = statusCode
    this.body = JSON.stringify(body)
  }
}
