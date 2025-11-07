import { Department, Priority, Status, User } from './types';

export const INITIAL_DEPARTMENT_OPTIONS: Department[] = [
  'Engineering',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
];

export const PRIORITY_OPTIONS: Priority[] = [
  Priority.Low,
  Priority.Medium,
  Priority.High,
  Priority.Critical,
];

export const STATUS_OPTIONS: (Status | 'All')[] = [
  'All',
  Status.Pending,
  Status.Reviewed,
  Status.Approved,
  Status.Rejected,
];

export const MOCK_USERS: User[] = [
    { name: 'Admin', id: 'admin', password: 'adminpassword', role: 'admin' },
    { name: 'Alice Smith', id: 'asmith', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', id: 'bjohnson', password: 'password123', role: 'user' },
    { name: 'Charlie Brown', id: 'cbrown', password: 'password123', role: 'user' },
    { name: 'Diana Prince', id: 'dprince', password: 'password123', role: 'user' },
];