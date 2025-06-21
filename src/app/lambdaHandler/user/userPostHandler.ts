import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UserCreator } from '../../../context/User/application/UserCreator'
import { withBodyValidation } from '../../shared/middleware/bodyValidationMiddleware'
import { withErrorHandling } from '../../shared/middleware/errorHandlingMiddleware'
import { withCorsHeaders } from '../../shared/middleware/corsMiddleware'
import { compose } from '../../shared/middleware/compose'
import { initializeDIContainer } from '../../../context/Shared/infrastructure/DI/DIContainer'

// Initialize DI container once
initializeDIContainer()

const userPostHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body as string)

  // Resolve UserCreator from the DI container
  const userCreator = container.resolve(UserCreator)
  await userCreator.run(body)

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'User created successfully',
      status: 'success',
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const userPostHandler = compose(
  withErrorHandling,
  withCorsHeaders({
    methods: ['POST', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization']
  }),
  withBodyValidation
)(userPostHandlerCore)
