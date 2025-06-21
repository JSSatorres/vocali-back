import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const hello = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const name = event.queryStringParameters?.name ?? 'World'

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${name}! Go Serverless v4! Your function executed successfully!`,
      requestId: event.requestContext.requestId
    })
  }
}
