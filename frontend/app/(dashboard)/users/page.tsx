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
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  department?: { name: string };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [departmentId, setDepartmentId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usrRes, depRes] = await Promise.all([
        api.get('/users'),
        api.get('/departments')
      ]);
      if (usrRes.data.success) setUsers(usrRes.data.data.users);
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

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/users/${id}/status`, { isActive: !currentStatus });
      if (res.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        departmentId: departmentId || null
      });
      if (res.data.success) {
        toast.success('User created successfully');
        setIsModalOpen(false);
        fetchData();
        setName(''); setEmail(''); setPassword('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department', render: (u) => u.department?.name || '-' },
    { 
      key: 'role', 
      label: 'Role',
      render: (u) => <Badge variant="info">{u.role}</Badge>
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (u) => (
        <Badge variant={u.isActive ? 'success' : 'danger'}>
          {u.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (u) => (
         <button 
           onClick={() => toggleStatus(u.id, u.isActive)}
           className={`text-xs font-medium px-2 py-1 rounded border ${u.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
         >
           {u.isActive ? 'Deactivate' : 'Activate'}
         </button>
      )
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add User</Button>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={users}
            keyExtractor={(u) => u.id}
            loading={loading}
            emptyMessage="No users found."
          />
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Temporary Password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Select 
            label="Role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            options={[
              { label: 'ADMIN', value: 'ADMIN' },
              { label: 'ENTRY_RECORDER', value: 'ENTRY_RECORDER' },
              { label: 'ANALYST', value: 'ANALYST' },
              { label: 'USER', value: 'USER' }
            ]}
          />
          <Select 
            label="Department" 
            value={departmentId} 
            onChange={(e) => setDepartmentId(e.target.value)}
            options={departments.map(d => ({ label: d.name, value: d.id }))}
            placeholder="Select Department"
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
