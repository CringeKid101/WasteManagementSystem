export interface Events {
  eventId: string;
  title: string;
  eventDate: string;
  eventDateObject?: Date;
  address: string;
  latitude: number;
  longitude: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  isJoined?: boolean;
  loading: boolean;
  totalVolunteers?: number;
}
