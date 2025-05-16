
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createDataItem, updateDataItem } from '@/lib/actions';
import type { DataItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  value: z.coerce.number().positive({ message: 'Value must be a positive number.' }),
  status: z.enum(['active', 'inactive', 'pending'], { required_error: 'Status is required.' }),
  description: z.string().optional(),
});

type DataFormValues = z.infer<typeof formSchema>;

interface DataFormProps {
  item?: DataItem | null;
  onFormSubmit: () => void; // Callback to close modal or refresh UI
  onCancel?: () => void;
  embeddedInDialog?: boolean; // New prop
}

export default function DataForm({ item, onFormSubmit, onCancel, embeddedInDialog = false }: DataFormProps) {
  const { toast } = useToast();
  const form = useForm<DataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item
      ? {
          name: item.name,
          category: item.category,
          value: item.value,
          status: item.status,
          description: item.description || '',
        }
      : {
          name: '',
          category: '',
          value: 0,
          status: 'pending',
          description: '',
        },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        value: item.value,
        status: item.status,
        description: item.description || '',
      });
    } else {
      form.reset({
        name: '',
        category: '',
        value: 0,
        status: 'pending',
        description: '',
      });
    }
  }, [item, form]);

  async function onSubmit(values: DataFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
         formData.append(key, String(value));
      }
    });

    const result = item
      ? await updateDataItem(item.id, formData)
      : await createDataItem(formData);

    if (result.errors) {
      toast({
        title: 'Error',
        description: result.message || (item ? 'Failed to update item.' : 'Failed to create item.'),
        variant: 'destructive',
      });
      // Optionally set form errors from result.errors
    } else {
      toast({
        title: 'Success!',
        description: result.message,
      });
      onFormSubmit();
      form.reset(); // Reset form after successful submission
    }
  }

  const actualForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Item Category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the item" {...field} />
              </FormControl>
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
            {form.formState.isSubmitting ? (item ? 'Updating...' : 'Creating...') : (item ? 'Update Item' : 'Create Item')}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (embeddedInDialog) {
    // When embedded, DialogContent provides p-6. Add a margin-top to separate from DialogHeader.
    return <div className="mt-4">{actualForm}</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle>{item ? 'Edit Item' : 'Create New Item'}</CardTitle>
        <CardDescription>
          {item ? `Update details for ${item.name}.` : 'Fill in the details for the new item.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actualForm}
      </CardContent>
    </Card>
  );
}
