import React from 'react';
import { ChangeRequest } from '../types';
import { ChangeRequestCard } from './ChangeRequestCard';

interface ChangeRequestListProps {
  requests: ChangeRequest[];
  title: string;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
  onMarkAsReviewed: (id: string) => void;
  isAdminView: boolean;
}

export const ChangeRequestList: React.FC<ChangeRequestListProps> = ({ requests, title, onApprove, onReject, onMarkAsReviewed, isAdminView }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3">{title}</h2>
      {requests.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500">No change requests match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[65vh] md:max-h-[calc(100vh-22rem)] overflow-y-auto pr-2">
          {requests.map((request) => (
            <ChangeRequestCard 
                key={request.id} 
                request={request} 
                onApprove={onApprove} 
                onReject={onReject}
                onMarkAsReviewed={onMarkAsReviewed}
                isAdminView={isAdminView}
            />
          ))}
        </div>
      )}
    </div>
  );
};