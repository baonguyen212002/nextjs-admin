
'use client'; // Mark as Client Component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Cog, Palette } from 'lucide-react'; 
import { Link } from 'next-intl/navigation'; 
import { useTranslations } from 'next-intl';


function QuickLinkButton({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  return (
    <Link 
      href={href}
      className="block p-6 rounded-lg border hover:bg-accent/10 hover:border-accent transition-all duration-200 shadow-sm text-center group"
    >
      <div className="flex flex-col items-center justify-center">
        <Icon className="h-8 w-8 mb-2 text-primary group-hover:text-accent-foreground" />
        <p className="font-medium text-primary group-hover:text-accent-foreground">{label}</p>
      </div>
    </Link>
  );
}

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLinkButton href="/settings/general" label={t('generalSettingsLink')} icon={Cog} />
          <QuickLinkButton href="/settings/appearance" label={t('appearanceSettingsLink')} icon={Palette} />
          {/* Add more settings links here as needed */}
        </CardContent>
      </Card>
    </div>
  );
}

