'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { useAuth } from '../../../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../../components/ui/Card';
import { Spinner } from '../../../../components/ui/Spinner';
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecordDetails {
  id: string;
  amount: number;
  nature: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  notes: string;
  createdAt: string;
  category: { name: string };
  department: { name: string };
  createdBy: { name: string; email: string };
  approvedBy?: { name: string };
}

export default function RecordProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, hasRole, isMounted } = useAuth();
  const [record, setRecord] = useState<RecordDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isMounted || !user) return;
    
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/records/${id}`);
        if (res.data.success) {
          setRecord(res.data.data);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch record');
        router.push('/records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, user, isMounted, router]);

  const handleApprove = async (status: 'APPROVED' | 'REJECTED') => {
    setProcessing(true);
    try {
      const res = await api.patch(`/records/${id}/approve`, { status });
      if (res.data.success) {
        toast.success(`Record marked as ${status}`);
        setRecord(res.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to update record status');
    } finally {
      setProcessing(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!record) return null;

  const StatusIcon = record.status === 'APPROVED' ? CheckCircle : record.status === 'REJECTED' ? XCircle : Clock;
  const statusColors = {
    APPROVED: 'text-green-600 bg-green-50 border-green-200',
    REJECTED: 'text-red-600 bg-red-50 border-red-200',
    PENDING: 'text-amber-600 bg-amber-50 border-amber-200'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => router.back()} className="rounded-full p-2 h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Record Profile</h2>
      </div>

      <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight flex items-center space-x-3">
              <span className={record.nature === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                {record.nature === 'INCOME' ? '+' : '-'} ₹{record.amount.toLocaleString('en-IN')}
              </span>
            </CardTitle>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{record.nature} LOG</p>
          </div>
          
          <div className={`flex items-center px-4 py-2 border rounded-full font-bold shadow-sm ${statusColors[record.status]}`}>
            <StatusIcon className="h-5 w-5 mr-2" />
            {record.status}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="mb-3">
                    <span className="text-gray-500 text-sm block mb-1">Date Logged</span>
                    <span className="font-semibold text-gray-900">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-500 text-sm block mb-1">Category</span>
                    <span className="font-semibold text-gray-900">{record.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Department</span>
                    <span className="font-semibold text-gray-900">{record.department?.name || 'General'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Personnel Tracing</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="mb-3">
                    <span className="text-gray-500 text-sm block mb-1">Created By</span>
                    <span className="font-semibold text-gray-900">{record.createdBy?.name || 'Unknown'}</span>
                    {record.createdBy?.email && <span className="text-gray-400 text-xs block">{record.createdBy.email}</span>}
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Approved By</span>
                    <span className="font-semibold text-gray-900">{record.approvedBy?.name || 'Pending Review'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Attached Notes</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[80px] shadow-inner">
                {record.notes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{record.notes}</p>
                ) : (
                  <p className="text-gray-400 italic">No notes attached to this record.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {hasRole(['ADMIN']) && record.status === 'PENDING' && (
          <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 border-t border-gray-100">
             <Button 
                variant="danger" 
                onClick={() => handleApprove('REJECTED')}
                disabled={processing}
                className="w-full sm:w-auto"
              >
                Reject Record
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleApprove('APPROVED')}
                disabled={processing}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Record
              </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
