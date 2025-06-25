import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaHandler } from '../createHandler'
import { HttpError } from '../../errors/HttpError'

export const withErrorHandling = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event)
    } catch (error: unknown) {
      console.error('Error in lambda handler:', error)

      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error.name ?? 'HttpError',
            message: error.message
          })
        }
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred'
        })
      }
    }
  }
}
