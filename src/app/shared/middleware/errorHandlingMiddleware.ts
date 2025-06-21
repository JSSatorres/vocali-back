import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export const withErrorHandling = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event)
    } catch (error: unknown) {
      console.error('Error in lambda handler:', error)

      if (error instanceof Error) {
        if (
          error.message.includes('Invalid') ||
          error.message.includes('cannot') ||
          error.message.includes('must') ||
          error.message.includes('required')
        ) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error: 'Validation Error',
              message: error.message
            })
          }
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
