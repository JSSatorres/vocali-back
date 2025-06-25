/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { APIGatewayProxyEvent } from 'aws-lambda'
import jwt from 'jsonwebtoken'

export const withAuth = (handler: any) => async (event: APIGatewayProxyEvent) => {
  const token =
    (typeof event.headers.Authorization === 'string' && event.headers.Authorization.trim() !== ''
      ? event.headers.Authorization
      : typeof event.headers.authorization === 'string' && event.headers.authorization.trim() !== ''
        ? event.headers.authorization
        : undefined)

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token missing' })
    }
  }

  try {
    const decoded = jwt.decode(token.replace('Bearer ', ''), { complete: true })

    if (!decoded) {
      throw new Error('Invalid token')
    }

    (event as any).user = decoded.payload

    return handler(event)
  } catch (err) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Unauthorized',
        error: err instanceof Error ? err.message : String(err)
      })
    }
  }
}
