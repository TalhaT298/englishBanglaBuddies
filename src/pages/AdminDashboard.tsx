import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, ListChecks, Home, 
  BarChart3, Settings, User as UserIcon, ChevronRight, 
  UserPlus, Banknote, Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  AdminDashboardStats, 
  User as UserType, 
  Subscription, 
  Payment,
  GirlfriendProfile
} from '@/types/girlfriend';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Mock data for demo purposes
const MOCK_STATS: AdminDashboardStats = {
  totalUsers: 256,
  activeUsers: 203,
  totalSubscriptions: 178,
  activeSubscriptions: 145,
  totalRevenue: 865000,
  monthlyRevenue: 125000,
  totalGirlfriends: 12,
  popularGirlfriends: [
    {id: '1', name: 'মারিয়া', count: 76},
    {id: '2', name: 'অনিকা', count: 64},
    {id: '3', name: 'নীলা', count: 43}
  ]
};

const MOCK_USERS: UserType[] = [
  {
    id: '1',
    name: 'রাহাত আহমেদ',
    email: 'rahat@example.com',
    avatar: '/placeholder.svg',
    role: 'admin',
    status: 'active',
    subscriptionStatus: 'premium',
    createdAt: '2023-06-15T10:30:00Z',
    lastLoginAt: '2023-09-20T14:25:00Z'
  },
  {
    id: '2',
    name: 'সুমন খান',
    email: 'suman@example.com',
    avatar: '/placeholder.svg',
    role: 'user',
    status: 'active',
    subscriptionStatus: 'basic',
    createdAt: '2023-07-22T09:15:00Z',
    lastLoginAt: '2023-09-19T16:40:00Z'
  },
  {
    id: '3',
    name: 'ফারিয়া ইসলাম',
    email: 'faria@example.com',
    avatar: '/placeholder.svg',
    role: 'user',
    status: 'suspended',
    subscriptionStatus: 'none',
    createdAt: '2023-08-05T11:20:00Z',
    lastLoginAt: '2023-09-10T10:15:00Z'
  },
  {
    id: '4',
    name: 'নাফিস চৌধুরী',
    email: 'nafis@example.com',
    avatar: '/placeholder.svg',
    role: 'user',
    status: 'active',
    subscriptionStatus: 'premium',
    createdAt: '2023-05-30T08:45:00Z',
    lastLoginAt: '2023-09-20T09:30:00Z'
  },
  {
    id: '5',
    name: 'সাদিয়া আক্তার',
    email: 'sadia@example.com',
    avatar: '/placeholder.svg',
    role: 'user',
    status: 'inactive',
    subscriptionStatus: 'free',
    createdAt: '2023-09-01T14:50:00Z',
    lastLoginAt: '2023-09-15T13:20:00Z'
  }
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    userId: '1',
    userName: 'রাহাত আহমেদ',
    plan: 'premium',
    status: 'active',
    startDate: '2023-07-01T00:00:00Z',
    endDate: '2024-07-01T00:00:00Z',
    autoRenew: true,
    price: 5000
  },
  {
    id: '2',
    userId: '2',
    userName: 'সুমন খান',
    plan: 'basic',
    status: 'active',
    startDate: '2023-08-15T00:00:00Z',
    endDate: '2023-11-15T00:00:00Z',
    autoRenew: true,
    price: 2000
  },
  {
    id: '3',
    userId: '4',
    userName: 'নাফিস চৌধুরী',
    plan: 'premium',
    status: 'active',
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    autoRenew: true,
    price: 5000
  },
  {
    id: '4',
    userId: '5',
    userName: 'সাদিয়া আক্তার',
    plan: 'free',
    status: 'active',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-10-01T00:00:00Z',
    autoRenew: false,
    price: 0
  }
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'রাহাত আহমেদ',
    amount: 5000,
    status: 'completed',
    method: 'bkash',
    transactionId: 'TX123456789',
    createdAt: '2023-07-01T10:25:00Z',
    description: 'Premium subscription for 1 year'
  },
  {
    id: '2',
    userId: '2',
    userName: 'সুমন খান',
    amount: 2000,
    status: 'completed',
    method: 'sslcommerz',
    transactionId: 'TX234567890',
    createdAt: '2023-08-15T11:30:00Z',
    description: 'Basic subscription for 3 months'
  },
  {
    id: '3',
    userId: '4',
    userName: 'নাফিস চৌধুরী',
    amount: 5000,
    status: 'completed',
    method: 'card',
    transactionId: 'TX345678901',
    createdAt: '2023-06-01T09:20:00Z',
    description: 'Premium subscription for 1 year'
  },
  {
    id: '4',
    userId: '3',
    userName: 'ফারিয়া ইসলাম',
    amount: 2000,
    status: 'failed',
    method: 'bkash',
    transactionId: 'TX456789012',
    createdAt: '2023-08-20T14:15:00Z',
    description: 'Basic subscription for 3 months'
  }
];

// Monthly revenue data for chart
const monthlyRevenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 61000 },
  { name: 'Apr', revenue: 58000 },
  { name: 'May', revenue: 63000 },
  { name: 'Jun', revenue: 72000 },
  { name: 'Jul', revenue: 80000 },
  { name: 'Aug', revenue: 95000 },
  { name: 'Sep', revenue: 125000 },
];

// Config for the revenue chart
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "#8B5CF6",
      dark: "#A78BFA",
    },
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminDashboardStats>(MOCK_STATS);
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  
  // Format currency for Bengali locale
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date to local format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('bn-BD', options);
  };
  
  // Get CSS class for status badges
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-sm md:h-screen md:fixed">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold">অ্যাডমিন প্যানেল</h1>
          </div>
          <nav className="p-4 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('overview');
                navigate('/admin-dashboard');
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              ড্যাশবোর্ড
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('users');
                navigate('/admin-dashboard?tab=users');
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              ব্যবহারকারী
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('subscriptions');
                navigate('/admin-dashboard?tab=subscriptions');
              }}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              সাবস্ক্রিপশন
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('payments');
                navigate('/admin-dashboard?tab=payments');
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              পেমেন্ট
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/admin')}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              সাথী ম্যানেজমেন্ট
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/')}
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              প্রধান পেজে ফিরে যান
            </Button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">ড্যাশবোর্ড</TabsTrigger>
              <TabsTrigger value="users">ব্যবহারকারী</TabsTrigger>
              <TabsTrigger value="subscriptions">সাবস্ক্রিপশন</TabsTrigger>
              <TabsTrigger value="payments">পেমেন্ট</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
