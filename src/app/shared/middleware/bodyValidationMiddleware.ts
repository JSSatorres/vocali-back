import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export const withBodyValidation = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (event.body === null || event.body === undefined || event.body.trim() === '') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Request body is required',
          message: 'The request body cannot be empty'
        })
      }
    }

    try {
      JSON.parse(event.body)
    } catch (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid JSON',
          message: 'The request body must be valid JSON'
        })
      }
    }

    return await handler(event)
  }
}
