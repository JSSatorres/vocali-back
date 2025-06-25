import { injectable } from 'tsyringe'
import { EventBus, EventHandler } from '../../domain/EventBus'
import { DomainEvent } from '../../domain/DomainEvent'

@injectable()
export class InMemoryEventBus implements EventBus {
  private readonly handlers: Map<string, EventHandler[]> = new Map()

  async publish (events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventHandlers = this.handlers.get(event.eventName) ?? []

      for (const handler of eventHandlers) {
        try {
          await handler.handle(event)
        } catch (error) {
          console.error(`Error handling event ${event.eventName}:`, error)
          // En un entorno real, aquí podrías implementar retry logic, DLQ, etc.
        }
      }
    }
  }

  subscribe (eventName: string, handler: EventHandler): void {
    const currentHandlers = this.handlers.get(eventName) ?? []
    currentHandlers.push(handler)
    this.handlers.set(eventName, currentHandlers)
  }
}
