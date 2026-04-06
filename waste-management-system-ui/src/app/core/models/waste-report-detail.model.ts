import { WasteReportImage } from './waste-report-image.model';
export interface WasteReportDetail {
  id: string;
  description: string;
    address: string;
    latitude: number;
    longitude: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
    updatedAt?: string;
    wasteType: string;
    images: WasteReportImage[];
}
