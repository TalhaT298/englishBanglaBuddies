
export interface GirlfriendProfile {
  id?: string;
  name: string;
  avatar: string;
  description: string;
  personality: string;
  level: number;
  topic: string;
  occupation: string;
  isUnlocked: boolean;
  skillLevel: number;
  customInstructions?: string;
  geminiPrompt?: string;
  flirtingStyle?: string;
  teachingStyle?: string;
  languageLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'inactive';
  subscriptionStatus: 'free' | 'basic' | 'premium' | 'none';
  createdAt: string;
  lastLoginAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'canceled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  price: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'bkash' | 'sslcommerz' | 'card' | 'other';
  transactionId: string;
  createdAt: string;
  description: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalGirlfriends: number;
  popularGirlfriends: Array<{id: string, name: string, count: number}>;
}
