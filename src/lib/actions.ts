'use server';

import type { DataItem } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Mock database
let mockData: DataItem[] = [
  { id: '1', name: 'Vintage Lamp', category: 'Home Decor', value: 75, status: 'active', lastUpdated: new Date().toISOString(), description: 'A beautiful vintage lamp from the 1920s.' },
  { id: '2', name: 'Handcrafted Mug', category: 'Kitchenware', value: 25, status: 'active', lastUpdated: new Date().toISOString(), description: 'A unique handcrafted ceramic mug.' },
  { id: '3', name: 'Abstract Painting', category: 'Art', value: 300, status: 'pending', lastUpdated: new Date().toISOString(), description: 'Modern abstract painting, oil on canvas.' },
  { id: '4', name: 'Leather Wallet', category: 'Accessories', value: 50, status: 'inactive', lastUpdated: new Date().toISOString(), description: 'Genuine leather wallet with multiple compartments.' },
];

const itemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  value: z.coerce.number().positive("Value must be a positive number"),
  status: z.enum(['active', 'inactive', 'pending']),
  description: z.string().optional(),
});

export async function fetchDataItems(): Promise<DataItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData;
}

export async function createDataItem(formData: FormData) {
  const validatedFields = itemSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    value: formData.get('value'),
    status: formData.get('status'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create item. Please check the fields.',
    };
  }

  const newItem: DataItem = {
    id: String(Date.now()), // Simple unique ID
    ...validatedFields.data,
    lastUpdated: new Date().toISOString(),
  };
  mockData.unshift(newItem); // Add to the beginning
  revalidatePath('/manage-data');
  return { message: 'Item created successfully!', item: newItem };
}

export async function updateDataItem(id: string, formData: FormData) {
  const validatedFields = itemSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    value: formData.get('value'),
    status: formData.get('status'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update item. Please check the fields.',
    };
  }
  
  const index = mockData.findIndex(item => item.id === id);
  if (index === -1) {
    return { message: 'Item not found.', errors: {} };
  }
  mockData[index] = { ...mockData[index], ...validatedFields.data, lastUpdated: new Date().toISOString() };
  revalidatePath('/manage-data');
  return { message: 'Item updated successfully!', item: mockData[index] };
}

export async function deleteDataItem(id: string) {
  mockData = mockData.filter(item => item.id !== id);
  revalidatePath('/manage-data');
  return { message: 'Item deleted successfully!' };
}

const uploadSchema = z.object({
  itemName: z.string().min(3, "Item name must be at least 3 characters"),
  itemDescription: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size > 0, "File is required")
    .refine(file => file.size < 5 * 1024 * 1024, "File size should be less than 5MB"), // 5MB limit
});

export async function uploadItemAction(formData: FormData) {
  const validatedFields = uploadSchema.safeParse({
    itemName: formData.get('itemName'),
    itemDescription: formData.get('itemDescription'),
    file: formData.get('file'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Upload failed. Please check the fields.',
    };
  }

  const { itemName, itemDescription, file } = validatedFields.data;

  // Simulate file upload process (e.g., save to a storage service)
  console.log(`Uploading item: ${itemName}, File: ${file.name}, Size: ${file.size} bytes`);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Add to mock data or a separate list of uploaded items
  const newItem: DataItem = {
    id: String(Date.now()),
    name: itemName,
    category: 'Uploaded', // Or derive from form
    value: 0, // Or derive from form
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    description: itemDescription,
    // In a real app, you'd store the file URL
    imageUrl: `https://placehold.co/300x200.png?text=${encodeURIComponent(itemName)}`, 
  };
  mockData.unshift(newItem);
  revalidatePath('/manage-data'); // if uploaded items appear in the main data table
  revalidatePath('/upload-items');


  return { message: `Item "${itemName}" uploaded successfully!`, item: newItem };
}
