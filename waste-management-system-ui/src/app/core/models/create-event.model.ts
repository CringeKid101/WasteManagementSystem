export interface CreateEvent {
  title: string;
  description: string;
  eventDate: string;
  address: string;
  maxParticipants: number;
  latitude: number;
  longitude: number;
  wasteReportIds: string[];
}
