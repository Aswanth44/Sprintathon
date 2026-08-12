/**
 * UzhavarSetu Event Bus Abstraction (Kafka Boundary)
 * 
 * Handles publishing supply-chain milestone events to an in-memory event queue.
 * 
 * // TODO: Replace MockEventBus with Kafka producer in Spring Boot backend.
 */
export const eventService = {
  /**
   * Publishes an event to the supply chain topic.
   * 
   * // SPRING BOOT KAFKA TOPIC: uzhavarsetu.supplychain.events
   * // Producer: KafkaTemplate.send("uzhavarsetu.supplychain.events", event)
   * // Real implementation: publishes event to Apache Kafka cluster.
   */
  async publish(eventData) {
    const payload = {
      eventId: eventData.eventId || `EVT-${Date.now()}`,
      batchId: eventData.batchId,
      eventType: eventData.eventType || 'MILESTONE_UPDATED',
      timestamp: eventData.timestamp || new Date().toISOString(),
      location: eventData.location || 'Coimbatore Region',
      actor: eventData.actor || 'System',
      description: eventData.description || 'Event published',
    }

    console.info('[MockEventBus -> Kafka Topic: uzhavarsetu.supplychain.events]', payload)
    return { success: true, topic: 'uzhavarsetu.supplychain.events', event: payload }
  },
}
