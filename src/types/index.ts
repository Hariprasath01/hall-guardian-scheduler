export interface Invigilator {
  id: string;
  name: string;
  email: string;
  phone: string;
  availability: string[]; // Days of the week: ['Monday', 'Wednesday', 'Sunday']
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Venue {
  id: string;
  name: string; // e.g., "IT Block"
  hallNumber: string; // e.g., "Hall 201"
  capacity?: number;
  status: 'active' | 'inactive';
}

export interface Allocation {
  id: string;
  invigilatorId: string;
  venueId: string;
  date: string; // YYYY-MM-DD format
  day: string; // Day of the week
  status: 'draft' | 'approved' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  invigilatorId: string;
  invigilatorName: string;
  venue: Venue;
  date: string;
  day: string;
  status: 'confirmed' | 'pending';
}

export type UserRole = 'admin' | 'invigilator';

export interface WeekDays {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
}