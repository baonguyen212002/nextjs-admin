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
import { useToast } from '@/hooks/use-toast';
import { uploadItemAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  itemName: z.string().min(3, { message: 'Item name must be at least 3 characters.' }),
  itemDescription: z.string().optional(),
  file: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "File is required.")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`) // 5MB
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
});

type UploadFormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      itemDescription: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('file', event.target.files as FileList); // Update react-hook-form state
    } else {
      setPreview(null);
      form.setValue('file', new DataTransfer().files); // Clear file if deselected
    }
  };

  async function onSubmit(values: UploadFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('itemName', values.itemName);
    if (values.itemDescription) {
      formData.append('itemDescription', values.itemDescription);
    }
    if (values.file && values.file[0]) {
      formData.append('file', values.file[0]);
    }

    const result = await uploadItemAction(formData);
    setIsSubmitting(false);

    if (result.errors) {
      toast({
        title: 'Upload Failed',
        description: result.message || 'Please check the form for errors.',
        variant: 'destructive',
      });
      // You can map result.errors to form errors if needed
      // Example: if (result.errors.itemName) form.setError('itemName', { message: result.errors.itemName[0] });
    } else {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
      setPreview(null);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          Upload New Item
        </CardTitle>
        <CardDescription>
          Provide item details and select a file to upload. Max file size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cool Gadget X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the item briefly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...restField } }) => ( // Destructure onChange, value from field
                <FormItem>
                  <FormLabel>Item File/Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      {...restField} // Spread rest of field props
                      onChange={handleFileChange} // Use custom handler
                      accept="image/jpeg,image/png,image/webp,image/gif"
                    />
                  </FormControl>
                  <FormDescription>
                    Supported formats: JPG, PNG, WEBP, GIF. Max 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <div className="mt-4">
                <FormLabel>Preview</FormLabel>
                <div className="mt-2 border rounded-md p-2 flex justify-center items-center bg-muted/50 aspect-video max-h-60">
                  <Image 
                    src={preview} 
                    alt="Selected file preview" 
                    width={200} 
                    height={200} 
                    className="max-h-full max-w-full object-contain rounded" 
                    data-ai-hint="file preview"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4 animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Item
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
