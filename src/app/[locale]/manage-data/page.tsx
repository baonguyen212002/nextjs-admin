import DataTable from '@/components/manage-data/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function ManageDataPage() {
  const t = useTranslations('ManageDataPage');
  return (
    <div className="space-y-6">
       <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>
    </div>
  );
}
