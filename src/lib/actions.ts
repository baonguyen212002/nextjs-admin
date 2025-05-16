'use server';

import type { DataItem, User } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Mock database for DataItems
let mockData: DataItem[] = [
  { id: '1', name: 'Vintage Lamp', category: 'Home Decor', value: 75, status: 'active', lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), imageUrl: `https://placehold.co/100x100.png?text=Lamp`, description: 'A beautiful vintage lamp from the 1920s.' },
  { id: '2', name: 'Handcrafted Mug', category: 'Kitchenware', value: 25, status: 'active', lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), imageUrl: `https://placehold.co/100x100.png?text=Mug`, description: 'A unique handcrafted ceramic mug.' },
  { id: '3', name: 'Abstract Painting', category: 'Art', value: 300, status: 'pending', lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), imageUrl: `https://placehold.co/100x100.png?text=Art`, description: 'Modern abstract painting, oil on canvas.' },
  { id: '4', name: 'Leather Wallet', category: 'Accessories', value: 50, status: 'inactive', lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), imageUrl: `https://placehold.co/100x100.png?text=Wallet`, description: 'Genuine leather wallet with multiple compartments.' },
];

const itemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  value: z.coerce.number().positive("Value must be a positive number"),
  status: z.enum(['active', 'inactive', 'pending']),
  description: z.string().optional(),
});

export async function fetchDataItems(): Promise<DataItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData.map(item => ({ ...item, imageUrl: item.imageUrl || `https://placehold.co/60x60.png?text=${item.name.substring(0,1)}`}));
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
    id: String(Date.now()),
    ...validatedFields.data,
    lastUpdated: new Date().toISOString(),
    imageUrl: `https://placehold.co/100x100.png?text=${validatedFields.data.name.substring(0,2)}`
  };
  mockData.unshift(newItem);
  revalidatePath('/manage-data');
  revalidatePath('/[locale]/manage-data', 'layout');
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
  revalidatePath('/[locale]/manage-data', 'layout');
  return { message: 'Item updated successfully!', item: mockData[index] };
}

export async function deleteDataItem(id: string) {
  mockData = mockData.filter(item => item.id !== id);
  revalidatePath('/manage-data');
  revalidatePath('/[locale]/manage-data', 'layout');
  return { message: 'Item deleted successfully!' };
}

// Upload Item Action Schema and Handler
const uploadSchema = z.object({
  itemName:        z.string().min(3, "Item name must be at least 3 characters"),
  itemDescription: z.string().optional(),
  file: z.custom<Blob>((v): v is Blob => v instanceof Blob, {
    message: "File is required",
  })
  .refine(blob => blob.size > 0, "File is required")
  .refine(blob => blob.size < 5 * 1024 * 1024, "File size should be less than 5MB"),
});

export async function uploadItemAction(formData: FormData) {
  const validatedFields = uploadSchema.safeParse({
    itemName:        formData.get('itemName'),
    itemDescription: formData.get('itemDescription'),
    file:             formData.get('file'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Upload failed. Please check the fields.',
    };
  }

  const { itemName, itemDescription, file } = validatedFields.data;
  console.log(`Uploading item: ${itemName}, Size: ${file.size} bytes`);
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // Convert Blob to Buffer for storage
  const buffer = Buffer.from(await file.arrayBuffer());
  // TODO: upload 'buffer' to your storage (e.g., S3)

  const newItem: DataItem = {
    id: String(Date.now()),
    name: itemName,
    category: 'Uploaded',
    value: 0,
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    description: itemDescription,
    imageUrl: `https://placehold.co/300x200.png?text=${encodeURIComponent(itemName)}`,
  };
  mockData.unshift(newItem);
  revalidatePath('/manage-data');
  revalidatePath('/upload-items');
  revalidatePath('/[locale]/manage-data', 'layout');
  revalidatePath('/[locale]/upload-items', 'layout');

  return { message: `Item "${itemName}" uploaded successfully!`, item: newItem };
}

// User Management Actions
let mockUsers: User[] = [
  { id: 'usr_1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'admin', status: 'active', lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(), avatarUrl: 'https://placehold.co/40x40.png?text=AW' },
  { id: 'usr_2', name: 'Bob The Builder', email: 'bob@example.com', role: 'editor', status: 'active', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), avatarUrl: 'https://placehold.co/40x40.png?text=BB' },
  { id: 'usr_3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', status: 'invited', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: 'usr_4', name: 'Diana Prince', email: 'diana@example.com', role: 'editor', status: 'disabled', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), avatarUrl: 'https://placehold.co/40x40.png?text=DP' },
];

const userSchema = z.object({
  name:   z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email:  z.string().email({ message: 'Invalid email address.' }),
  role:   z.enum(['admin', 'editor', 'viewer'], { required_error: 'Role is required.' }),
  status: z.enum(['active', 'invited', 'disabled'], { required_error: 'Status is required.' }),
});

export async function fetchUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers.map(user => ({
    ...user,
    avatarUrl: user.avatarUrl || `https://placehold.co/40x40.png?text=${user.name.substring(0,1)}`
  }));
}

export async function createUserAction(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name:   formData.get('name'),
    email:  formData.get('email'),
    role:   formData.get('role'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create user. Please check the fields.',
    };
  }

  if (mockUsers.some(user => user.email === validatedFields.data.email)) {
     return {
      errors: { email: ['Email already exists.'] },
      message: 'Failed to create user. Email already in use.',
    };
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    ...validatedFields.data,
    lastLogin: new Date().toISOString(),
    avatarUrl: `https://placehold.co/40x40.png?text=${validatedFields.data.name.substring(0,1)}`
  };
  mockUsers.unshift(newUser);
  revalidatePath('/settings/users');
  revalidatePath('/[locale]/settings/users', 'layout');
  return { message: 'User created successfully!', user: newUser };
}

export async function updateUserAction(id: string, formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name:   formData.get('name'),
    email:  formData.get('email'),
    role:   formData.get('role'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update user. Please check the fields.',
    };
  }

  const index = mockUsers.findIndex(user => user.id === id);
  if (index === -1) {
    return { message: 'User not found.', errors: {} };
  }

  if (mockUsers.some(user => user.email === validatedFields.data.email && user.id !== id)) {
     return {
      errors: { email: ['Email already exists for another user.'] },
      message: 'Failed to update user. Email already in use.',
    };
  }

  mockUsers[index] = { ...mockUsers[index], ...validatedFields.data };
  revalidatePath('/settings/users');
  revalidatePath('/[locale]/settings/users', 'layout');
  return { message: 'User updated successfully!', user: mockUsers[index] };
}

export async function deleteUserAction(id: string) {
  mockUsers = mockUsers.filter(user => user.id !== id);
  revalidatePath('/settings/users');
  revalidatePath('/[locale]/settings/users', 'layout');
  return { message: 'User deleted successfully!' };
}

// Profile Update Action
const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

export async function updateUserProfileAction(userId: string, formData: FormData) {
  if (!userId) {
    return { errors: { general: ['User ID is missing.'] }, message: 'Failed to update profile.' };
  }

  const validatedFields = profileUpdateSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update profile. Please check the fields.',
    };
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { errors: { general: ['User not found.'] }, message: 'User not found.' };
  }

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    name: validatedFields.data.name,
  };
  
  revalidatePath('/[locale]/settings/profile', 'page');

  return { 
    message: 'Profile updated successfully!', 
    user: mockUsers[userIndex] 
  };
}