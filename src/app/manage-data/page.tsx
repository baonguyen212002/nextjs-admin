import DataTable from '@/components/manage-data/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManageDataPage() {
  return (
    <div className="space-y-6">
       <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Manage Data</CardTitle>
          <CardDescription>
            View, create, edit, and delete data items in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable />
        </CardContent>
      </Card>
    </div>
  );
}
