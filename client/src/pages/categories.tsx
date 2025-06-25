import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { z } from 'zod';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { CategoryWithChildren } from '@shared/schema';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
  slug: z.string().min(1, 'Slug gereklidir'),
  description: z.string().optional(),
  parentId: z.number().nullable().optional(),
  sortOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;
type SortOption = 'name' | 'newsCount' | 'createdAt' | 'sortOrder';
type ViewMode = 'cards' | 'table';
type StatusFilter = 'all' | 'active' | 'inactive';

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('sortOrder');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      sortOrder: 0,
      isActive: true,
    },
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
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

  const reorderCategoriesMutation = useMutation({
    mutationFn: async (categoryOrders: { id: number; sortOrder: number }[]) => {
      await apiRequest('POST', '/api/categories/reorder', { categoryOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Başarılı',
        description: 'Kategori sıralaması güncellendi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Kategori sıralaması güncellenirken bir hata oluştu',
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
      sortOrder: (category as any).sortOrder || 0,
      isActive: (category as any).isActive !== undefined ? (category as any).isActive : true,
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredAndSortedCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort orders
    const categoryOrders = items.map((category, index) => ({
      id: category.id,
      sortOrder: index + 1
    }));

    reorderCategoriesMutation.mutate(categoryOrders);
  };

  // Filter and sort categories
  const filteredAndSortedCategories = categories
    .filter(category => {
      // Text search filter
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filter
      const isActive = (category as any).isActive !== false;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'newsCount':
          return ((b as any).newsCount || 0) - ((a as any).newsCount || 0);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'sortOrder':
          return ((a as any).sortOrder || 0) - ((b as any).sortOrder || 0);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => (cat as any).isActive !== false).length;
  const totalNews = categories.reduce((sum, cat) => sum + ((cat as any).newsCount || 0), 0);
  const avgNewsPerCategory = totalCategories > 0 ? Math.round(totalNews / totalCategories * 100) / 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LucideIcons.Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>
          <p className="text-muted-foreground">
            Haber kategorilerinizi düzenleyin ve yönetin
          </p>
        </div>
        <Button onClick={handleCreateCategory} className="min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          Yeni Kategori
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <LucideIcons.Tags className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Kategori</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktif Kategori</p>
                <p className="text-2xl font-bold">{activeCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <LucideIcons.FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Haber</p>
                <p className="text-2xl font-bold">{totalNews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <LucideIcons.BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ortalama/Kategori</p>
                <p className="text-2xl font-bold">{avgNewsPerCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreleme ve Kontroller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-40 min-h-[44px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Aktif</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Pasif</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sortOrder">Sıralama (0-9)</SelectItem>
                  <SelectItem value="name">Ad (A-Z)</SelectItem>
                  <SelectItem value="newsCount">Haber Sayısı</SelectItem>
                  <SelectItem value="createdAt">Tarih (Yeni)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex rounded-lg border overflow-hidden">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-none"
                >
                  <LucideIcons.Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none"
                >
                  <LucideIcons.List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Kategoriler ({filteredAndSortedCategories.length} sonuç)</span>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <LucideIcons.Move className="w-4 h-4" />
              <span>Sürükle & Bırak</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAndSortedCategories.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <div className="text-muted-foreground">
                            <LucideIcons.Tags className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">
                              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz kategori bulunmuyor'}
                            </h3>
                            <p className="text-sm">
                              {searchQuery ? 'Farklı anahtar kelimeler deneyin' : 'Yeni kategori ekleyerek başlayın'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        filteredAndSortedCategories.map((category, index) => (
                          <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Card 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary ${snapshot.isDragging ? 'opacity-75 rotate-3 scale-105 shadow-2xl' : ''}`}
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                          <LucideIcons.Tag className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                          {category.name}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                          <Badge variant={(category as any).isActive !== false ? "default" : "secondary"} className="text-xs">
                                            {(category as any).isActive !== false ? "Aktif" : "Pasif"}
                                          </Badge>
                                          {((category as any).sortOrder || 0) > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                              #{(category as any).sortOrder}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                        /{category.slug}
                                      </p>
                                    </div>
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <LucideIcons.MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                          <LucideIcons.Edit className="w-4 h-4 mr-2" />
                                          Düzenle
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                                          disabled={deleteCategoryMutation.isPending || (category.newsCount || 0) > 0}
                                          className="text-destructive"
                                        >
                                          <LucideIcons.Trash className="w-4 h-4 mr-2" />
                                          Sil
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  {category.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                      {category.description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-1 text-sm">
                                        <LucideIcons.FileText className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium">{category.newsCount || 0}</span>
                                        <span className="text-muted-foreground">haber</span>
                                      </div>
                                    </div>
                                    
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kategori Adı</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Sıra</TableHead>
                            <TableHead>Haber Sayısı</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="w-20">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedCategories.map((category, index) => (
                            <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <TableRow 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${snapshot.isDragging ? 'opacity-75 scale-105 shadow-lg' : ''} transition-all duration-200`}
                                >
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                      <LucideIcons.Tag className="w-4 h-4 text-primary" />
                                      <span>{category.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <code className="text-sm bg-muted px-2 py-1 rounded">/{category.slug}</code>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={(category as any).isActive !== false ? "default" : "secondary"} className="text-xs">
                                      {(category as any).isActive !== false ? "Aktif" : "Pasif"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {((category as any).sortOrder || 0) > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        #{(category as any).sortOrder}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-1">
                                      <LucideIcons.FileText className="w-4 h-4 text-blue-500" />
                                      <span>{category.newsCount || 0}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <LucideIcons.MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                          <LucideIcons.Edit className="w-4 h-4 mr-2" />
                                          Düzenle
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                                          disabled={deleteCategoryMutation.isPending || (category.newsCount || 0) > 0}
                                          className="text-destructive"
                                        >
                                          <LucideIcons.Trash className="w-4 h-4 mr-2" />
                                          Sil
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Add/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Temel Bilgiler</h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Adı *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Örn: Teknoloji"
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="min-h-[44px]"
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
                        <FormLabel>URL Slug *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="teknoloji"
                            className="min-h-[44px] font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Kategori hakkında kısa açıklama..."
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ayarlar</h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sıra Numarası</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
                            className="min-h-[44px]"
                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aktif Durum</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Kategori aktif olsun mu?
                          </div>
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
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px]"
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending}
                  className="min-h-[44px]"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    selectedCategory ? 'Güncelle' : 'Oluştur'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}