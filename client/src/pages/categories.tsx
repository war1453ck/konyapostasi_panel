import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertCategorySchema } from '@shared/schema';
import type { CategoryWithChildren } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
};

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
    },
  });

  const { data: categories = [], isLoading } = useQuery<CategoryWithChildren[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) throw new Error('Kategoriler yüklenemedi');
      return response.json();
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (selectedCategory) {
        return await apiRequest('PUT', `/api/categories/${selectedCategory.id}`, data);
      } else {
        return await apiRequest('POST', '/api/categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Başarılı',
        description: selectedCategory ? 'Kategori güncellendi' : 'Kategori oluşturuldu',
      });
      setIsModalOpen(false);
      setSelectedCategory(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Kategori kaydedilirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Başarılı',
        description: 'Kategori silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Kategori silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (!selectedCategory) {
      form.setValue('slug', generateSlug(name));
    }
  };

  const handleEditCategory = (category: CategoryWithChildren) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId,
    });
    setIsModalOpen(true);
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      parentId: null,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="loading-spinner w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Kategoriler</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Haber kategorilerini yönetin</p>
        </div>
        <Button onClick={handleCreateCategory} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Kategori</span>
          <span className="sm:hidden">Kategori Ekle</span>
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kategori Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="responsive-table">
            <TableHeader>
              <TableRow>
                <TableHead>Kategori Adı</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Haber Sayısı</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      Henüz kategori bulunmuyor
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="text-sm">
                      {category.description?.substring(0, 50)}
                      {category.description && category.description.length > 50 && '...'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <LucideIcons.FileText className="w-4 h-4 mr-1" />
                        {category.newsCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          disabled={deleteCategoryMutation.isPending || (category.newsCount || 0) > 0}
                        >
                          <LucideIcons.Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Adı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kategori adını girin..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kategori açıklaması..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending 
                    ? 'Kaydediliyor...' 
                    : selectedCategory 
                      ? 'Güncelle' 
                      : 'Oluştur'
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
