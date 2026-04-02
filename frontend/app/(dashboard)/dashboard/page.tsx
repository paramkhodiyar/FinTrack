'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { Select } from '../../../components/ui/Select';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

interface CategoryBreakdown {
  categoryName: string;
  amount: number;
}

interface DepartmentBreakdown {
  departmentName: string;
  amount: number;
}

interface TrendData {
  period: string;
  income: number;
  expense: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [departments, setDepartments] = useState<DepartmentBreakdown[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('LAST_MONTH');
  const { user, isMounted, hasRole } = useAuth();

  useEffect(() => {
    if (!isMounted || !user) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = `?period=${periodFilter}`;
        const [sumRes, catRes, trendsRes, deptRes] = await Promise.all([
          api.get(`/dashboard/summary${query}`),
          api.get(`/dashboard/categories${query}`),
          api.get(`/dashboard/trends${query}`),
          api.get(`/dashboard/departments${query}`)
        ]);

        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (trendsRes.data.success) setTrends(trendsRes.data.data);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isMounted, periodFilter]);

  if (!isMounted || (!user && loading)) {
    return <div className="h-64" />;
  }

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6', '#ec4899'];

  const formatRupee = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  // Trend Chart
  const trendData = {
    labels: trends.map(t => t.period),
    datasets: [
      {
        label: 'Income',
        data: trends.map(t => t.income),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expense',
        data: trends.map(t => t.expense),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatRupee(context.raw)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: any) => '₹' + value.toLocaleString('en-IN') }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  // Category Chart
  const categoryData = {
    labels: categories.map(c => c.categoryName),
    datasets: [
      {
        data: categories.map(c => c.amount),
        backgroundColor: COLORS,
        borderWidth: 0,
      }
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${formatRupee(context.raw)}`
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200
    }
  };

  // Department Bar Chart
  const departmentData = {
    labels: departments.map(d => d.departmentName),
    datasets: [
      {
        label: 'Department Expenses',
        data: departments.map(d => d.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  const departmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${formatRupee(context.raw)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: any) => '₹' + value.toLocaleString('en-IN') }
      }
    },
    animation: {
      duration: 1200
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h2>
          <p className="text-gray-500">Your financial summary and recent insights.</p>
        </div>
        <div className="w-48">
          <Select 
            value={periodFilter} 
            onChange={(e) => setPeriodFilter(e.target.value)}
            options={[
              { label: 'Today', value: 'TODAY' },
              { label: 'Last Week', value: 'LAST_WEEK' },
              { label: 'Last Month', value: 'LAST_MONTH' },
              { label: 'All Time', value: 'ALL' }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-all">
                  {summary ? formatRupee(summary.totalIncome) : '₹0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expense</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-all">
                  {summary ? formatRupee(summary.totalExpense) : '₹0'}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <ArrowDownRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 transition-all">
                  {summary ? formatRupee(summary.netBalance) : '₹0'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80 relative">
            {trends.length > 0 ? (
               <Line data={trendData} options={trendOptions} />
            ) : (
               <div className="flex h-full items-center justify-center text-gray-500">No trend data available.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80 relative flex justify-center">
            {categories.length > 0 ? (
                <Doughnut data={categoryData} options={categoryOptions} />
            ) : (
                <div className="flex h-full items-center justify-center text-gray-500">No category breakdown available.</div>
            )}
          </CardContent>
        </Card>
        
        {hasRole(['ADMIN', 'ANALYST']) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Expenses by Department</CardTitle>
            </CardHeader>
            <CardContent className="h-80 relative">
              {departments.length > 0 ? (
                 <Bar data={departmentData} options={departmentOptions} />
              ) : (
                 <div className="flex h-full items-center justify-center text-gray-500">No department data available.</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
