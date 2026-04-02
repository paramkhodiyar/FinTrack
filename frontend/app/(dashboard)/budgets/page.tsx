'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Table, ColumnDef } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Budget {
  id: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string;
  category?: { name: string };
  department?: { name: string };
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budRes, catRes, depRes] = await Promise.all([
        api.get('/budgets'),
        hasRole(['ADMIN']) ? api.get('/categories') : Promise.resolve({ data: { success: false } }),
        hasRole(['ADMIN']) ? api.get('/departments') : Promise.resolve({ data: { success: false } })
      ]);
      
      if (budRes.data.success) setBudgets(budRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
      if (depRes.data?.success) setDepartments(depRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/budgets', {
        amount,
        period,
        startDate,
        endDate,
        categoryId: categoryId || null,
        departmentId
      });
      if (res.data.success) {
        toast.success('Budget created');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
       console.error(error);
    }
  };

  const columns: ColumnDef<Budget>[] = [
    { key: 'department', label: 'Department', render: (b) => b.department?.name || '-' },
    { key: 'category', label: 'Category', render: (b) => b.category?.name || 'All Categories' },
    { key: 'amount', label: 'Amount', render: (b) => <span className="font-medium">₹{b.amount.toLocaleString('en-IN')}</span> },
    { key: 'period', label: 'Period' },
    { key: 'startDate', label: 'Start Date', render: (b) => new Date(b.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (b) => new Date(b.endDate).toLocaleDateString() },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budgets</CardTitle>
          {hasRole(['ADMIN']) && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add Budget</Button>
          )}
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={budgets}
            keyExtractor={(b) => b.id}
            loading={loading}
            emptyMessage="No budgets found."
          />
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Budget">
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Select 
            label="Department" 
            value={departmentId} 
            onChange={(e) => setDepartmentId(e.target.value)}
            options={departments.map(d => ({ label: d.name, value: d.id }))}
            placeholder="Select Department"
            required
          />
          <Select 
            label="Category (Optional)" 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            placeholder="All Categories"
          />
          <Select label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} options={[{ label: 'MONTHLY', value: 'MONTHLY' }, { label: 'YEARLY', value: 'YEARLY' }]} />
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
