import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MagazineCategory, InsertMagazineCategory } from '@shared/schema';

const magazineCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
  slug: z.string().min(1, 'Slug gereklidir'),
  description: z.string().optional(),
  color: z.string().default('#3B82F6'),
  icon: z.string().default('BookOpen'),
  parentId: z.number().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

type MagazineCategoryFormData = z.infer<typeof magazineCategorySchema>;

const availableIcons = [
  'BookOpen', 'Newspaper', 'FileText', 'Calendar', 'Camera', 'Music',
  'Palette', 'Gamepad2', 'Car', 'Home', 'Heart', 'Star',
  'Trophy', 'Globe', 'Briefcase', 'GraduationCap'
];

const availableColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function MagazineCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MagazineCategory | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MagazineCategoryFormData>({
    resolver: zodResolver(magazineCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6',
      icon: 'BookOpen',
      sortOrder: 0,
      isActive: true,
    },
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/magazine-categories'],
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: InsertMagazineCategory) =>
      apiRequest('/api/magazine-categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazine-categories'] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla oluşturuldu',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kategori oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<InsertMagazineCategory> & { id: number }) =>
      apiRequest(`/api/magazine-categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazine-categories'] });
      setIsModalOpen(false);
      setSelectedCategory(null);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla güncellendi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kategori güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/magazine-categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Silme işlemi başarısız' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/magazine-categories'] });
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla silindi',
      });
    },
    onError: (error: any) => {
      console.error('Delete category error:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Kategori silinirken bir hata oluştu',
        variant: 'destructive',
      });
    },
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

  const onSubmit = (data: MagazineCategoryFormData) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, ...data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: MagazineCategory) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3B82F6',
      icon: category.icon || 'BookOpen',
      parentId: category.parentId || undefined,
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriyi kullanan dergiler varsa önce onları başka kategorilere taşımanız gerekebilir.')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LucideIcons.Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dergi Kategorileri</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Dijital dergi kategorilerinizi yönetin</p>
        </div>
        <Button onClick={handleCreateCategory} className="w-full sm:w-auto">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          Yeni Kategori
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: MagazineCategory) => {
          const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.BookOpen;
          
          return (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <LucideIcons.MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                      <LucideIcons.Edit className="w-4 h-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600"
                    >
                      <LucideIcons.Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Sıra: {category.sortOrder}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
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
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          if (!selectedCategory) {
                            form.setValue('slug', generateSlug(e.target.value));
                          }
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
                      <Input {...field} />
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
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İkon</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableIcons.map((icon) => {
                            const IconComponent = LucideIcons[icon as keyof typeof LucideIcons];
                            return (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{icon}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renk</FormLabel>
                      <div className="flex space-x-1">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-6 h-6 rounded border-2 ${
                              field.value === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sıra</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Aktif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

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
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                    <LucideIcons.Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {selectedCategory ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}