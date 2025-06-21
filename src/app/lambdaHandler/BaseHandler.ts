import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export abstract class BaseHandler {
  protected createResponse (statusCode: number, body: any): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(body)
    }
  }

  protected createErrorResponse (statusCode: number, message: string): APIGatewayProxyResult {
    return this.createResponse(statusCode, {
      error: message
    })
  }

  abstract handle (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
}
