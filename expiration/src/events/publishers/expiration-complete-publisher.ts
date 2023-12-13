import { Subjects, Publisher, ExpirationCompleteEvent } from "@blackanimegirl/txcommon";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}