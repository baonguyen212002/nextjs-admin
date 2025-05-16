
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserAction, updateUserAction } from '@/lib/actions';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  role: z.enum(['admin', 'editor', 'viewer'], { required_error: 'Role is required.' }),
  status: z.enum(['active', 'invited', 'disabled'], { required_error: 'Status is required.' }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User | null;
  onFormSubmit: () => void;
  onCancel?: () => void;
}

export default function UserForm({ user, onFormSubmit, onCancel }: UserFormProps) {
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      : {
          name: '',
          email: '',
          role: 'viewer', // Default role
          status: 'invited', // Default status
        },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'viewer',
        status: 'invited',
      });
    }
  }, [user, form]);

  async function onSubmit(values: UserFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = user
      ? await updateUserAction(user.id, formData)
      : await createUserAction(formData);

    if (result.errors) {
      toast({
        title: 'Error',
        description: result.message || (user ? 'Failed to update user.' : 'Failed to create user.'),
        variant: 'destructive',
      });
      // Set form errors if they match specific fields
      if (result.errors.name) form.setError('name', { message: result.errors.name[0] });
      if (result.errors.email) form.setError('email', { message: result.errors.email[0] });
      if (result.errors.role) form.setError('role', { message: result.errors.role[0] });
      if (result.errors.status) form.setError('status', { message: result.errors.status[0] });
    } else {
      toast({
        title: 'Success!',
        description: result.message,
      });
      onFormSubmit();
      form.reset(); 
    }
  }

  return (
    <div className="mt-4"> {/* Added mt-4 to match DataForm's embeddedInDialog style */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
              </Button>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (user ? 'Updating User...' : 'Creating User...') : (user ? 'Update User' : 'Create User')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
