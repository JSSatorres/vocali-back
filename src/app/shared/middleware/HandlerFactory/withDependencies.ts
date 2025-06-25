import '../../../../context/Shared/infrastructure/DI/DIContainer'
import { Middleware } from './compose'

export const withDependencies: Middleware = (handler) => {
  return async (event) => {
    return await handler(event)
  }
}
