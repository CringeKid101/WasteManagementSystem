export interface OrganizerRequestDetails {
    id: number;
    userId: number;
    userName: string;
    email: string;
    eventsAttended: number;
    reportsSubmitted: number;
    reason: string,
    status: string;
    createdAt: Date;
}