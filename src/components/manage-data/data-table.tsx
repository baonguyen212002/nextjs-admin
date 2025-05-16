
'use client';

import { useState, useEffect } from 'react';
import type { DataItem } from '@/types';
import { fetchDataItems, deleteDataItem } from '@/lib/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle, RefreshCw, Eye } from 'lucide-react';
import DataForm from './data-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataTable() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [itemToView, setItemToView] = useState<DataItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await fetchDataItems();
      setData(items);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item: DataItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  
  const handleView = (item: DataItem) => {
    setItemToView(item);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (item: DataItem) => {
    setItemToDelete(item);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const result = await deleteDataItem(itemToDelete.id);
    toast({ title: 'Success', description: result.message });
    setItemToDelete(null);
    loadData(); // Refresh data
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
    loadData(); // Refresh data
  };

  const getStatusBadgeVariant = (status: DataItem['status']) => {
    switch (status) {
      case 'active':
        return 'default'; // bg-primary
      case 'inactive':
        return 'secondary'; // bg-secondary
      case 'pending':
        return 'outline'; // border, text-foreground
      default:
        return 'default';
    }
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Data Items</h2>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={loadData} disabled={isLoading} aria-label="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleAddNew} disabled={isLoading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setSelectedItem(null);
          } else {
            setIsFormOpen(true);
          }
        }}>
          <DialogContent className="sm:max-w-2xl">
            {/* DataForm is rendered inside the DialogContent by parent page if this component is not managing its own Dialog */}
            {/* This is a common pattern, or manage Dialog state here */}
             <DataForm 
                item={selectedItem} 
                onFormSubmit={handleFormSubmit}
                onCancel={() => { setIsFormOpen(false); setSelectedItem(null); }}
              />
          </DialogContent>
        </Dialog>
      )}
      
      {itemToView && (
        <Dialog open={!!itemToView} onOpenChange={() => setItemToView(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{itemToView.name}</DialogTitle>
              <DialogDescription>Category: {itemToView.category}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              {itemToView.imageUrl && (
                <Image 
                  src={itemToView.imageUrl} 
                  alt={itemToView.name} 
                  width={300} 
                  height={200} 
                  className="rounded-md object-cover mx-auto"
                  data-ai-hint="product item" 
                />
              )}
              <p><strong>ID:</strong> {itemToView.id}</p>
              <p><strong>Value:</strong> ${itemToView.value.toFixed(2)}</p>
              <div className="flex items-center">
                <strong className="mr-1">Status:</strong> <Badge variant={getStatusBadgeVariant(itemToView.status)}>{itemToView.status}</Badge>
              </div>
              <p><strong>Last Updated:</strong> {format(new Date(itemToView.lastUpdated), "PPP p")}</p>
              {itemToView.description && <p><strong>Description:</strong> {itemToView.description}</p>}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && data.length > 0 && [...Array(3)].map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell className="text-right space-x-2">
                  <Skeleton className="h-8 w-8 inline-block" />
                  <Skeleton className="h-8 w-8 inline-block" />
                  <Skeleton className="h-8 w-8 inline-block" />
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image 
                    src={item.imageUrl || `https://placehold.co/60x60.png?text=${item.name.substring(0,1)}`} 
                    alt={item.name} 
                    width={40} 
                    height={40} 
                    className="rounded-md object-cover"
                    data-ai-hint="product item" 
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">${item.value.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(item.lastUpdated), 'PP')}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)} aria-label="View Item">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} aria-label="Edit Item">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(item)} aria-label="Delete Item">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              "{itemToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
