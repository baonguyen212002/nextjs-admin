
'use client'; // Mark as Client Component

import UserTable from '@/components/users/user-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UserManagementPage() {
  const t = useTranslations('UserManagementPage');
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable />
        </CardContent>
      </Card>
    </div>
  );
}

