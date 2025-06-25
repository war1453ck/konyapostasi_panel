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
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type SortOption = 'name' | 'newsCount' | 'createdAt';
type ViewMode = 'cards' | 'table';

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
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

  // Filter and sort categories
  const filteredAndSortedCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'newsCount':
          return (b.newsCount || 0) - (a.newsCount || 0);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalCategories = categories.length;
  const totalNews = categories.reduce((sum, cat) => sum + (cat.newsCount || 0), 0);
  const avgNewsPerCategory = totalCategories > 0 ? Math.round(totalNews / totalCategories) : 0;

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Kategori Yönetimi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Profesyonel kategori organizasyonu ve analizi</p>
        </div>
        <Button onClick={handleCreateCategory} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Kategori</span>
          <span className="sm:hidden">Kategori Ekle</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <LucideIcons.FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
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
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <LucideIcons.BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ortalama/Kategori</p>
                <p className="text-2xl font-bold">{avgNewsPerCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <LucideIcons.TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktif Sonuç</p>
                <p className="text-2xl font-bold">{filteredAndSortedCategories.length}</p>
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
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
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
                  className="rounded-none border-0 min-h-[44px]"
                >
                  <LucideIcons.Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none border-0 min-h-[44px]"
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
          <CardTitle>
            Kategoriler ({filteredAndSortedCategories.length} sonuç)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Professional Cards View */}
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
                filteredAndSortedCategories.map((category) => (
                  <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
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
                          
                          {(category.newsCount || 0) > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Aktif
                            </Badge>
                          )}
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
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
                {filteredAndSortedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <LucideIcons.Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        {searchQuery ? 'Arama kriterine uygun kategori bulunamadı' : 'Henüz kategori bulunmuyor'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedCategories.map((category) => (
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
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {filteredAndSortedCategories.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <LucideIcons.Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  {searchQuery ? 'Arama kriterine uygun kategori bulunamadı' : 'Henüz kategori bulunmuyor'}
                </div>
              </div>
            ) : (
              filteredAndSortedCategories.map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        /{category.slug}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8 p-0"
                      >
                        <LucideIcons.Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        disabled={deleteCategoryMutation.isPending || (category.newsCount || 0) > 0}
                        className="h-8 w-8 p-0"
                      >
                        <LucideIcons.Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <LucideIcons.FileText className="w-4 h-4 mr-1" />
                      <span>{category.newsCount || 0} haber</span>
                    </div>
                    
                    {category.parentId && (
                      <Badge variant="outline" className="text-xs">
                        Alt Kategori
                      </Badge>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Professional Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LucideIcons.Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {selectedCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory 
                    ? 'Kategori bilgilerini güncelleyin ve değişiklikleri kaydedin' 
                    : 'Yeni bir kategori oluşturun ve haber organizasyonunuzu geliştirin'
                  }
                </p>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <LucideIcons.Info className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Temel Bilgiler</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <LucideIcons.Type className="w-4 h-4" />
                          <span>Kategori Adı</span>
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Örn: Teknoloji, Spor, Ekonomi..."
                            className="h-11"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleNameChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Kategori için açıklayıcı bir ad girin
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <LucideIcons.Link className="w-4 h-4" />
                          <span>URL Slug</span>
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              /
                            </span>
                            <Input 
                              placeholder="teknoloji-haberleri" 
                              className="h-11 pl-6 font-mono text-sm"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          URL'de görünecek benzersiz kimlik
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <LucideIcons.FileText className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Açıklama ve Detaylar</h3>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <LucideIcons.AlignLeft className="w-4 h-4" />
                        <span>Kategori Açıklaması</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bu kategori hangi tür haberleri içerir? Okuyucular için açıklayıcı bir tanım yazın..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        SEO ve kullanıcı deneyimi için önemlidir (isteğe bağlı)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <LucideIcons.Shield className="w-4 h-4" />
                  <span>Tüm alanlar güvenli şekilde saklanır</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="min-w-[100px]"
                  >
                    <LucideIcons.X className="w-4 h-4 mr-2" />
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {createCategoryMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Kaydediliyor...
                      </>
                    ) : selectedCategory ? (
                      <>
                        <LucideIcons.Save className="w-4 h-4 mr-2" />
                        Güncelle
                      </>
                    ) : (
                      <>
                        <LucideIcons.Plus className="w-4 h-4 mr-2" />
                        Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
