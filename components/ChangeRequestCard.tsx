import React, { useState } from 'react';
import { ChangeRequest, Status, Priority } from '../types';
import { CalendarIcon, UserIcon, BuildingIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, ClockIcon, BoltIcon, InformationCircleIcon, EyeIcon, PencilIcon, ChipIcon } from './icons';

interface ChangeRequestCardProps {
  request: ChangeRequest;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
  onMarkAsReviewed: (id: string) => void;
  isAdminView: boolean;
}

const statusStyles = {
  [Status.Pending]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [Status.Reviewed]: 'bg-slate-200 text-slate-800 border-slate-400',
  [Status.Approved]: 'bg-green-100 text-green-800 border-green-300',
  [Status.Rejected]: 'bg-red-100 text-red-800 border-red-300',
};

const priorityStyles = {
    [Priority.Low]: 'bg-blue-100 text-blue-800',
    [Priority.Medium]: 'bg-indigo-100 text-indigo-800',
    [Priority.High]: 'bg-orange-100 text-orange-800',
    [Priority.Critical]: 'bg-red-200 text-red-900',
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const Icon = {
        [Status.Pending]: ClockIcon,
        [Status.Reviewed]: EyeIcon,
        [Status.Approved]: CheckCircleIcon,
        [Status.Rejected]: XCircleIcon,
    }[status];

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
            <Icon className="h-4 w-4" />
            {status}
        </span>
    );
};

export const ChangeRequestCard: React.FC<ChangeRequestCardProps> = ({ request, onApprove, onReject, onMarkAsReviewed, isAdminView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');

  const handleConfirmReject = () => {
    if (rejectionRemarks.trim()) {
      onReject(request.id, rejectionRemarks);
      setShowRejectForm(false);
      setRejectionRemarks('');
    }
  };
  
  const handleConfirmApprove = () => {
      onApprove(request.id, approvalRemarks);
      setShowApproveForm(false);
      setApprovalRemarks('');
  };

  const handleToggleExpand = () => {
    if (isAdminView && request.status === Status.Pending && !isExpanded) {
        onMarkAsReviewed(request.id);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 cursor-pointer" onClick={handleToggleExpand}>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-slate-800">{request.title}</h3>
                 <span className={`mt-1 text-xs font-semibold inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline rounded-full ${priorityStyles[request.priority]}`}>
                    Priority: {request.priority}
                </span>
            </div>
            <StatusBadge status={request.status} />
        </div>
        <div className="mt-3 text-sm text-slate-500 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>{request.requester}</span>
            </div>
            <div className="flex items-center">
                <BuildingIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>{request.department}</span>
            </div>
             <div className="flex items-center">
                <ChipIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>{request.system}</span>
            </div>
            <div className="flex items-center" title={`Requested on ${new Date(request.requestDate).toLocaleString()}`}>
                <PencilIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center" title={`Target implementation on ${new Date(request.implementationDate).toLocaleString()}`}>
                <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span>Target: {new Date(request.implementationDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div className="flex justify-end items-center mt-2">
            <span className="text-xs text-slate-400 mr-1">{isExpanded ? 'Hide' : 'Show'} Details</span>
            <ChevronDownIcon className={`h-5 w-5 text-slate-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
            <div className="mt-4 space-y-4">
                {request.status === Status.Rejected && request.remarks && (
                    <div>
                        <h4 className="font-semibold text-slate-700">Rejection Remarks</h4>
                        <p className="mt-1 text-sm text-red-700 p-3 bg-red-50 border border-red-200 rounded-md italic flex items-start">
                           <InformationCircleIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                           <span>{request.remarks}</span>
                        </p>
                    </div>
                )}
                 {request.status === Status.Approved && request.remarks && (
                    <div>
                        <h4 className="font-semibold text-slate-700">Approval Remarks (Next Steps)</h4>
                        <p className="mt-1 text-sm text-green-700 p-3 bg-green-50 border border-green-200 rounded-md italic flex items-start">
                           <InformationCircleIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                           <span>{request.remarks}</span>
                        </p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-700">AI Generated Summary</h4>
                    <p className="mt-1 text-sm text-slate-600 p-3 bg-blue-50 border border-blue-200 rounded-md italic flex items-start">
                        <BoltIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{request.summary}</span>
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">System / Module</h4>
                    <p className="mt-1 text-sm text-slate-600">{request.system}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Description</h4>
                    <p className="mt-1 text-sm text-slate-600">{request.description}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Reason for Change</h4>
                    <p className="mt-1 text-sm text-slate-600">{request.reason}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">Impact Assessment</h4>
                    <p className="mt-1 text-sm text-slate-600">{request.impact}</p>
                </div>
            </div>
        </div>
      )}
      {isAdminView && (request.status === Status.Pending || request.status === Status.Reviewed) && (
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
            {showRejectForm ? (
                 <div className="space-y-2">
                    <label htmlFor={`remarks-${request.id}`} className="block text-sm font-medium text-slate-700">Rejection Remarks (Required)</label>
                    <textarea
                        id={`remarks-${request.id}`}
                        value={rejectionRemarks}
                        onChange={(e) => setRejectionRemarks(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Provide a reason for rejecting this request..."
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => { setShowRejectForm(false); setRejectionRemarks(''); }}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmReject}
                            disabled={!rejectionRemarks.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                            Confirm Reject
                        </button>
                    </div>
                </div>
            ) : showApproveForm ? (
                <div className="space-y-2">
                    <label htmlFor={`approval-remarks-${request.id}`} className="block text-sm font-medium text-slate-700">Approval Remarks / Next Steps (Optional)</label>
                    <textarea
                        id={`approval-remarks-${request.id}`}
                        value={approvalRemarks}
                        onChange={(e) => setApprovalRemarks(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="e.g., 'Approved. Please schedule for deployment with the Ops team.'"
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => { setShowApproveForm(false); setApprovalRemarks(''); }}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmApprove}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
                        >
                            Confirm Approve
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => { setShowRejectForm(true); setShowApproveForm(false); }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2"
                    >
                        <XCircleIcon className="h-5 w-5"/> Reject
                    </button>
                    <button
                        onClick={() => { setShowApproveForm(true); setShowRejectForm(false); }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-2"
                    >
                        <CheckCircleIcon className="h-5 w-5"/> Approve
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};