import { Publisher, Subjects, TicketCreatedEvent } from "@blackanimegirl/txcommon";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}