export enum Status {
  Pending = 'Pending',
  Reviewed = 'Reviewed',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export type Department = string;

export interface ChangeRequest {
  id: string;
  title: string;
  system: string;
  requester: string;
  department: Department;
  description: string;
  reason: string;
  impact: string;
  priority: Priority;
  requestDate: string;
  implementationDate: string;
  status: Status;
  summary: string;
  remarks?: string;
}

export type NewChangeRequest = Omit<ChangeRequest, 'id' | 'status' | 'summary' | 'remarks' | 'requestDate'>;

export type User = {
    name: string;
    id: string;
    password: string;
    role: 'admin' | 'user';
};