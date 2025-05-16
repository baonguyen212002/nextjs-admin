
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { Edit3, KeyRound, UserCircle, UserCog } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns'; // For formatting dates

// Mock user data - replace with actual data fetching logic
const mockUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  avatarUrl: 'https://placehold.co/128x128.png',
  role: 'Administrator',
  status: 'Active',
  lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
};

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Profile Avatar & Basic Info Section */}
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-2 border-primary shadow-lg">
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="person avatar" />
                <AvatarFallback>
                  <UserCircle className="h-20 w-20 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">{mockUser.name}</h2>
                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit3 className="mr-2 h-4 w-4" />
                {t('uploadAvatarButton')}
              </Button>
            </div>

            {/* Profile Details Section */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('detailsCardTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('nameLabel')}</span>
                    <span className="text-md text-foreground">{mockUser.name}</span>
                  </div>
                  <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('emailLabel')}</span>
                    <span className="text-md text-foreground">{mockUser.email}</span>
                  </div>
                  <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('roleLabel')}</span>
                    <span className="text-md text-foreground">{mockUser.role}</span>
                  </div>
                   <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('statusLabel')}</span>
                    <span className="text-md text-foreground">{mockUser.status}</span>
                  </div>
                  <Separator />
                   <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('lastLoginLabel')}</span>
                    <span className="text-md text-foreground">
                      {format(new Date(mockUser.lastLogin), 'PPP p')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('actionsCardTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Button variant="default">
                    <Edit3 className="mr-2 h-4 w-4" />
                    {t('editProfileButton')}
                  </Button>
                  <Button variant="outline">
                    <KeyRound className="mr-2 h-4 w-4" />
                    {t('changePasswordButton')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
