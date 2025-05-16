export const dynamic = 'force-dynamic';

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';
import GeneralSettingsForm from '@/components/settings/general-settings-form';
import { useTranslations } from 'next-intl';

export default function GeneralSettingsPage() {
  const t = useTranslations('GeneralSettingsPage');
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeneralSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}