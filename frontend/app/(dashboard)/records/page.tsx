'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import { Table, ColumnDef } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Record {
  id: string;
  amount: number;
  nature: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  category?: { name: string };
  department?: { name: string };
}

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole, user } = useAuth();
  const [amount, setAmount] = useState('');
  const [nature, setNature] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, catRes] = await Promise.all([
        api.get('/records'),
        api.get('/categories')
      ]);
      if (recRes.data.success) setRecords(recRes.data.data.records);
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/records/${id}/approve`, { status });
      if (res.data.success) {
        toast.success(`Record ${status.toLowerCase()} successfully`);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) return toast.error('Amount and date are required');

    try {
      const res = await api.post('/records', {
        amount: parseFloat(amount),
        nature,
        categoryId: categoryId || null,
        date: new Date(date).toISOString(),
        notes,
        departmentId: user?.departmentId
      });
      if (res.data.success) {
        toast.success('Record added successfully');
        setIsModalOpen(false);
        fetchData();
        setAmount(''); setNotes('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<Record>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (r) => new Date(r.date).toLocaleDateString(),
    },
    {
      key: 'nature',
      label: 'Type',
      render: (r) => (
        <Badge variant={r.nature === 'INCOME' ? 'success' : 'default'}>
          {r.nature}
        </Badge>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (r) => r.category?.name || '-',
    },
    {
      key: 'department',
      label: 'Department',
      render: (r) => r.department?.name || '-',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (r) => <span className="font-medium">₹{r.amount.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => {
        let variant: 'success' | 'warning' | 'danger' = 'warning';
        if (r.status === 'APPROVED') variant = 'success';
        if (r.status === 'REJECTED') variant = 'danger';
        return <Badge variant={variant}>{r.status}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => {
        return (
          <div className="flex space-x-2 items-center">
            <Link href={`/records/${r.id}`}>
              <Button variant="secondary" className="py-1 px-2 text-xs border border-gray-300">View</Button>
            </Link>
            {hasRole(['ADMIN']) && r.status === 'PENDING' && (
              <>
                <Button variant="primary" onClick={() => handleStatusUpdate(r.id, 'APPROVED')} className="py-1 px-2 text-xs">Approve</Button>
                <Button variant="danger" onClick={() => handleStatusUpdate(r.id, 'REJECTED')} className="py-1 px-2 text-xs">Reject</Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial Records</CardTitle>
          {hasRole(['ADMIN', 'ENTRY_RECORDER']) && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add Record</Button>
          )}
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={records}
            keyExtractor={(r) => r.id}
            loading={loading}
            emptyMessage="No records found."
          />
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Record">
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Select
            label="Type"
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            options={[
              { label: 'EXPENSE', value: 'EXPENSE' },
              { label: 'INCOME', value: 'INCOME' }
            ]}
          />
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            placeholder="Select Category"
          />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
