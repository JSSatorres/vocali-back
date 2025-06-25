import { DomainEvent } from './DomainEvent'

export interface EventHandler {
  handle: (event: DomainEvent) => Promise<void>
}

export interface EventBus {
  publish: (events: DomainEvent[]) => Promise<void>
  subscribe: (eventName: string, handler: EventHandler) => void
}
