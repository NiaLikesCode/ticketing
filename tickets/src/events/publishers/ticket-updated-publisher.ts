import { Publisher, Subjects, TicketUpdatedEvent } from "@blackanimegirl/txcommon";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}