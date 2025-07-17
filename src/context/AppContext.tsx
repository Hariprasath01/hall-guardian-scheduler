import { createContext, useContext, useState, ReactNode } from 'react';
import { Invigilator, Venue, Allocation, UserRole } from '@/types';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  invigilators: Invigilator[];
  setInvigilators: (invigilators: Invigilator[]) => void;
  venues: Venue[];
  setVenues: (venues: Venue[]) => void;
  allocations: Allocation[];
  setAllocations: (allocations: Allocation[]) => void;
  currentInvigilatorId: string | null;
  setCurrentInvigilatorId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockInvigilators: Invigilator[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1-234-567-8901',
    availability: ['Monday', 'Wednesday', 'Friday'],
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    phone: '+1-234-567-8902',
    availability: ['Tuesday', 'Thursday'],
    status: 'active',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+1-234-567-8903',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'active',
    createdAt: new Date('2024-01-17'),
  }
];

const mockVenues: Venue[] = [
  { id: '1', name: 'IT Block', hallNumber: 'Hall 201', capacity: 50, status: 'active' },
  { id: '2', name: 'IT Block', hallNumber: 'Hall 202', capacity: 60, status: 'active' },
  { id: '3', name: 'Science Block', hallNumber: 'Hall 301', capacity: 45, status: 'active' },
  { id: '4', name: 'Arts Block', hallNumber: 'Hall 101', capacity: 55, status: 'active' },
  { id: '5', name: 'Main Building', hallNumber: 'Hall 401', capacity: 70, status: 'active' },
];

const mockAllocations: Allocation[] = [
  {
    id: '1',
    invigilatorId: '1',
    venueId: '1',
    date: '2024-01-22',
    day: 'Monday',
    status: 'published',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    invigilatorId: '2',
    venueId: '3',
    date: '2024-01-23',
    day: 'Tuesday',
    status: 'approved',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [invigilators, setInvigilators] = useState<Invigilator[]>(mockInvigilators);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations);
  const [currentInvigilatorId, setCurrentInvigilatorId] = useState<string | null>('1');

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      invigilators,
      setInvigilators,
      venues,
      setVenues,
      allocations,
      setAllocations,
      currentInvigilatorId,
      setCurrentInvigilatorId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}