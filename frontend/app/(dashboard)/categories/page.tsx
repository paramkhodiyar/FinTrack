'use client';

import React, { useEffect, useState } from 'react';
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

interface Category {
  id: string;
  name: string;
  nature: string;
  parentId: string | null;
  parent?: { name: string };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole } = useAuth();
  
  const [name, setName] = useState('');
  const [nature, setNature] = useState('EXPENSE');
  const [parentId, setParentId] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Name is required');

    try {
      const res = await api.post('/categories', {
        name,
        nature,
        parentId: parentId || null
      });
      if (res.data.success) {
        toast.success('Category created');
        setIsModalOpen(false);
        fetchCategories();
        setName('');
        setParentId('');
      }
    } catch (error) {
       console.error(error);
    }
  };

  const columns: ColumnDef<Category>[] = [
    { key: 'name', label: 'Name' },
    { 
      key: 'nature', 
      label: 'Nature',
      render: (c) => <Badge variant={c.nature === 'INCOME' ? 'success' : 'default'}>{c.nature}</Badge>
    },
    { 
      key: 'parent', 
      label: 'Parent Category',
      render: (c) => c.parent ? <span className="text-gray-500">{c.parent.name}</span> : <span className="text-gray-400 italic">None</span>
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          {hasRole(['ADMIN']) && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add Category</Button>
          )}
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={categories}
            keyExtractor={(c) => c.id}
            loading={loading}
            emptyMessage="No categories found."
          />
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Category">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input 
            label="Category Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Server Hosting" 
            required 
          />
          <Select 
            label="Nature" 
            value={nature} 
            onChange={(e) => setNature(e.target.value)}
            options={[
              { label: 'EXPENSE', value: 'EXPENSE' },
              { label: 'INCOME', value: 'INCOME' }
            ]}
          />
          <Select 
            label="Parent Category (Optional)" 
            value={parentId} 
            onChange={(e) => setParentId(e.target.value)}
            placeholder="No Parent"
            options={categories.filter(c => c.nature === nature).map(c => ({
              label: c.name,
              value: c.id
            }))}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
