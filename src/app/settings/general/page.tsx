
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';
import GeneralSettingsForm from '@/components/settings/general-settings-form';

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>
            Manage general application settings, such as site name, default language, and timezone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeneralSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
