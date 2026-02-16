export enum BookingType {
  Scheduled = 'Scheduled',
  WalkIn = 'Walk-in',
  Emergency = 'Emergency'
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  bloodType: string;
  bookingType: BookingType;
  status: 'Coming' | 'Waiting' | 'Current Patient' | 'Treated';
  bookingDate: string;
  treatedAt?: string;
  arrivedAt?: string;
}
