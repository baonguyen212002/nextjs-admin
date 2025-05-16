export interface DataItem {
  id: string;
  name: string;
  category: string;
  value: number;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string; // ISO date string
  description?: string;
  imageUrl?: string;
}

export interface Metric {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  lastLogin: string; // ISO date string
  avatarUrl?: string;
}
