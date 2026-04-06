export interface EventDetails {
    eventId: string;
    title: string;
    description: string;
    eventDate: string;
    address: string;
    latitude: number;
    longitude: number;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    wasteLocations: { lat: number; lng: number }[];
    wasteImages: string[];
}
