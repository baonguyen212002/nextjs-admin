
'use client'; // Mark as Client Component

import MetricCard from '@/components/dashboard/metric-card';
import PersonalizedBanner from '@/components/shared/personalized-banner';
import type { Metric } from '@/types';
import { Users, Package, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Link } from 'next-intl/navigation'; 
import { useTranslations } from 'next-intl';

const metrics: Metric[] = [
  { title: 'Total Users', value: '1,250', icon: Users, change: '+15%', changeType: 'positive' },
  { title: 'Active Items', value: '340', icon: Package, change: '+5', changeType: 'positive' },
  { title: 'Total Sales', value: '$12,860', icon: DollarSign, change: '-2.3%', changeType: 'negative' },
  { title: 'Pending Orders', value: '42', icon: ShoppingCart, change: '+8', changeType: 'positive' },
];

const recentActivities = [
  { id: 1, user: 'Alice Johnson', action: 'updated item "Vintage Lamp"', time: '2 mins ago', userImage: 'https://placehold.co/40x40.png', userImageHint: 'woman face' },
  { id: 2, user: 'Bob Williams', action: 'added new item "Handcrafted Mug"', time: '15 mins ago', userImage: 'https://placehold.co/40x40.png', userImageHint: 'man face' },
  { id: 3, user: 'System', action: 'processed 10 new orders', time: '1 hour ago', userImage: 'https://placehold.co/40x40.png', userImageHint: 'server icon' },
  { id: 4, user: 'Carol Davis', action: 'resolved support ticket #789', time: '3 hours ago', userImage: 'https://placehold.co/40x40.png', userImageHint: 'woman face' },
];

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');

  return (
    <div className="space-y-6">
      <PersonalizedBanner
        title={t('welcomeBannerTitle')}
        message={t('welcomeBannerMessage')}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              {t('recentActivitiesTitle')}
            </CardTitle>
            <CardDescription>{t('recentActivitiesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Image
                    src={activity.userImage}
                    alt={activity.user}
                    width={40}
                    height={40}
                    className="rounded-full"
                    data-ai-hint={activity.userImageHint}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}.
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('quickLinksTitle')}</CardTitle>
            <CardDescription>{t('quickLinksDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <QuickLinkButton href="/manage-data" label={t('manageAllDataLink')} />
             <QuickLinkButton href="/upload-items" label={t('uploadNewItemLink')} />
             <QuickLinkButton href="/settings/users" label={t('userManagementLink')} />
             <QuickLinkButton href="/reports" label={t('viewReportsLink')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-md border hover:bg-accent/10 hover:border-accent transition-all duration-200 shadow-sm text-center group"
    >
      <p className="font-medium text-primary group-hover:text-accent-foreground">{label}</p>
    </Link>
  );
}

