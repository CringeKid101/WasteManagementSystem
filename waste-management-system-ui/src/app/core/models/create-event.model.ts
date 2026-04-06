export interface CreateEvent {
  title: string;
  description: string;
  date: Date;
  address: string;
  maxVolunteers: number;
  latitude: number;
  longitude: number;
  wasteReportIds: string[];
}
