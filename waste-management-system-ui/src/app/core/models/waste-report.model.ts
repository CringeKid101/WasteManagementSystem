export interface WasteReport {
  id: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  eventId?: string;
  createdAt: string;
}

