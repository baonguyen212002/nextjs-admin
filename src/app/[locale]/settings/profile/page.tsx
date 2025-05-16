
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Edit3, KeyRound, UserCircle, UserCog, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/types';
import { updateUserProfileAction } from '@/lib/actions';

// Static parts of the mock user, lastLogin will be generated client-side
const staticMockUserDetails: Omit<User, 'lastLogin'> = {
  id: 'usr_1',
  name: 'Admin User',
  email: 'admin@example.com',
  avatarUrl: 'https://placehold.co/128x128.png',
  role: 'Administrator',
  status: 'Active',
};

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const tForm = useTranslations('ProfileEditForm');
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '', // Initial safe default
    },
  });

  useEffect(() => {
    // This effect runs only on the client, after initial hydration
    const clientGeneratedLastLogin = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(); // 3 hours ago
    setCurrentUser({
      ...staticMockUserDetails,
      lastLogin: clientGeneratedLastLogin,
    });
  }, []); // Empty dependency array ensures this runs once on mount

  // Reset form when currentUser becomes available or dialog is reopened
  useEffect(() => {
    if (currentUser) {
      form.reset({ name: currentUser.name });
    }
  }, [currentUser, form, isEditModalOpen]);


  const handleEditProfileSubmit = async (values: ProfileFormValues) => {
    if (!currentUser) return; // Should not happen if button is disabled while loading

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', values.name);
    
    const result = await updateUserProfileAction(currentUser.id, formData);
    setIsSubmitting(false);

    if (result.errors || !result.user) {
      toast({
        title: tForm('updateErrorTitle'),
        description: result.message || tForm('updateErrorMessage'),
        variant: 'destructive',
      });
      if (result.errors?.name) {
        form.setError('name', { message: result.errors.name[0]});
      }
    } else {
      toast({
        title: tForm('updateSuccessTitle'),
        description: result.message,
      });
      setCurrentUser(result.user); // Update local state with the returned user data
      setIsEditModalOpen(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

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
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="person avatar" />
                <AvatarFallback>
                  <UserCircle className="h-20 w-20 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
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
                    <span className="text-md text-foreground">{currentUser.name}</span>
                  </div>
                  <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('emailLabel')}</span>
                    <span className="text-md text-foreground">{currentUser.email}</span>
                  </div>
                  <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('roleLabel')}</span>
                    <span className="text-md text-foreground">{currentUser.role}</span>
                  </div>
                   <Separator />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('statusLabel')}</span>
                    <span className="text-md text-foreground">{currentUser.status}</span>
                  </div>
                  <Separator />
                   <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{t('lastLoginLabel')}</span>
                    <span className="text-md text-foreground">
                      {format(new Date(currentUser.lastLogin), 'PPP p')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('actionsCardTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Button variant="default" onClick={() => setIsEditModalOpen(true)}>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tForm('dialogTitle')}</DialogTitle>
            <DialogDescription>{tForm('dialogDescription')}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditProfileSubmit)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('nameLabel')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">{tForm('cancelButton')}</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      {tForm('savingButton')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {tForm('saveButton')}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    