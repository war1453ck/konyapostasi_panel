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
import { Separator } from '@/components/ui/separator';
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
import type { DigitalMagazine, InsertDigitalMagazine } from '@shared/schema';

const digitalMagazineSchema = z.object({
  title: z.string().min(1, 'Dergi başlığı gereklidir'),
  issueNumber: z.number().min(1, 'Sayı numarası 1 veya daha büyük olmalıdır'),
  volume: z.number().min(1, 'Cilt numarası 1 veya daha büyük olmalıdır').optional(),
  publishDate: z.string().min(1, 'Yayın tarihi gereklidir'),
  coverImageUrl: z.string().min(1, 'Kapak görseli gereklidir'),
  pdfUrl: z.string().optional().or(z.literal('')),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tags: z.string().optional(),
  language: z.string().default('tr'),
  price: z.string().default('0.00'),
});

type DigitalMagazineFormData = z.infer<typeof digitalMagazineSchema>;

// Categories will be fetched from API

export default function DigitalMagazinePage() {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: 'all',
    isPublished: 'all',
    isFeatured: 'all'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<DigitalMagazine | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  // Önizleme modalı için state değişkenleri
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewMagazine, setPreviewMagazine] = useState<DigitalMagazine | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DigitalMagazineFormData>({
    resolver: zodResolver(digitalMagazineSchema),
    defaultValues: {
      title: '',
      issueNumber: 1,
      volume: 1,
      publishDate: new Date().toISOString().split('T')[0],
      coverImageUrl: '',
      pdfUrl: '',
      description: '',
      categoryId: undefined,
      isPublished: false,
      isFeatured: false,
      tags: '',
      language: 'tr',
      price: '0.00',
    },
  });

  const { data: magazines = [], isLoading } = useQuery({
    queryKey: ['/api/digital-magazines'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/magazine-categories'],
  });

  const createMagazineMutation = useMutation({
    mutationFn: (data: InsertDigitalMagazine) =>
      apiRequest('POST', '/api/digital-magazines', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/digital-magazines'] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Dergi başarıyla oluşturuldu',
      });
    },
    onError: (error: any) => {
      console.error('Dergi oluşturma hatası:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Dergi oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const updateMagazineMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<InsertDigitalMagazine> & { id: number }) =>
      apiRequest('PATCH', `/api/digital-magazines/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/digital-magazines'] });
      setIsModalOpen(false);
      setSelectedMagazine(null);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Dergi başarıyla güncellendi',
      });
    },
    onError: (error: any) => {
      console.error('Dergi güncelleme hatası:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Dergi güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const deleteMagazineMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/digital-magazines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/digital-magazines'] });
      toast({
        title: 'Başarılı',
        description: 'Dergi başarıyla silindi',
      });
    },
    onError: (error: any) => {
      console.error('Dergi silme hatası:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Dergi silinirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const filteredMagazines = magazines.filter((magazine: DigitalMagazine) => {
    const matchesSearch = magazine.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         magazine.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.categoryId || filters.categoryId === 'all' || 
                           magazine.categoryId?.toString() === filters.categoryId;
    const matchesPublished = filters.isPublished === '' || filters.isPublished === 'all' || 
                           (filters.isPublished === 'true' ? magazine.isPublished : !magazine.isPublished);
    const matchesFeatured = filters.isFeatured === '' || filters.isFeatured === 'all' || 
                          (filters.isFeatured === 'true' ? magazine.isFeatured : !magazine.isFeatured);
    
    return matchesSearch && matchesCategory && matchesPublished && matchesFeatured;
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const onSubmit = (data: DigitalMagazineFormData) => {
    // Tüm zorunlu alanların dolu olduğundan emin olalım
    if (!data.title || !data.issueNumber || !data.publishDate || !data.coverImageUrl) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm zorunlu alanları doldurun: Başlık, Sayı Numarası, Yayın Tarihi ve Kapak Görseli',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // publishDate'i ISO formatına dönüştür
      const publishDate = new Date(data.publishDate);
      
      const formData = {
        ...data,
        // Sayısal değerleri kontrol et
        issueNumber: Number(data.issueNumber),
        volume: data.volume ? Number(data.volume) : undefined,
        // categoryId'nin sayı olduğundan emin ol
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        // Tarihi ISO formatına dönüştür
        publishDate: publishDate.toISOString(),
        // Etiketleri diziye dönüştür
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      console.log("Gönderilen veri:", formData);

      if (selectedMagazine) {
        updateMagazineMutation.mutate({ id: selectedMagazine.id, ...formData });
      } else {
        createMagazineMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Form verisi dönüştürme hatası:", error);
      toast({
        title: 'Hata',
        description: 'Veri formatı dönüştürülürken bir hata oluştu. Lütfen tüm alanları kontrol edin.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateMagazine = () => {
    setSelectedMagazine(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditMagazine = (magazine: DigitalMagazine) => {
    setSelectedMagazine(magazine);
    form.reset({
      title: magazine.title,
      issueNumber: magazine.issueNumber,
      volume: magazine.volume || undefined,
      publishDate: new Date(magazine.publishDate).toISOString().split('T')[0],
      coverImageUrl: magazine.coverImageUrl,
      pdfUrl: magazine.pdfUrl || '',
      description: magazine.description || '',
      categoryId: magazine.categoryId ? Number(magazine.categoryId) : undefined,
      isPublished: magazine.isPublished,
      isFeatured: magazine.isFeatured,
      tags: magazine.tags?.join(', ') || '',
      language: magazine.language || 'tr',
      price: magazine.price || '0.00',
    });
    setIsModalOpen(true);
  };

  const handleDeleteMagazine = (id: number) => {
    if (confirm('Bu dergiyi silmek istediğinizden emin misiniz?')) {
      deleteMagazineMutation.mutate(id);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/newspaper-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Dosya yüklenemedi');
      }

      const result = await response.json();
      form.setValue('coverImageUrl', result.url);
      
      toast({
        title: 'Başarılı',
        description: 'Kapak görseli başarıyla yüklendi',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Kapak görseli yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/upload/newspaper-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF yüklenemedi');
      }

      const result = await response.json();
      form.setValue('pdfUrl', result.url);
      
      toast({
        title: 'Başarılı',
        description: 'PDF başarıyla yüklendi',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'PDF yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  // Dergi önizleme fonksiyonu
  const handlePreviewMagazine = (magazine: DigitalMagazine) => {
    setPreviewMagazine(magazine);
    setIsPreviewModalOpen(true);
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dijital Dergi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Dijital dergi sayılarınızı yönetin</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="w-full sm:w-auto"
          >
            {viewMode === 'grid' ? (
              <>
                <LucideIcons.List className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Liste Görünümü</span>
                <span className="sm:hidden">Liste</span>
              </>
            ) : (
              <>
                <LucideIcons.Grid className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Kart Görünümü</span>
                <span className="sm:hidden">Kart</span>
              </>
            )}
          </Button>
          <Button onClick={handleCreateMagazine} className="w-full sm:w-auto">
            <LucideIcons.Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Yeni Dergi</span>
            <span className="sm:hidden">Ekle</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Dergi</CardTitle>
            <LucideIcons.BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{magazines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yayınlanan</CardTitle>
            <LucideIcons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {magazines.filter((m: DigitalMagazine) => m.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öne Çıkan</CardTitle>
            <LucideIcons.Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {magazines.filter((m: DigitalMagazine) => m.isFeatured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İndirme</CardTitle>
            <LucideIcons.Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {magazines.reduce((total: number, m: DigitalMagazine) => total + (m.downloadCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              placeholder="Dergi ara..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.categoryId}
              onValueChange={(value) => setFilters({ ...filters, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.isPublished}
              onValueChange={(value) => setFilters({ ...filters, isPublished: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Yayın durumu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hepsi</SelectItem>
                <SelectItem value="true">Yayınlanan</SelectItem>
                <SelectItem value="false">Taslak</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.isFeatured}
              onValueChange={(value) => setFilters({ ...filters, isFeatured: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Öne çıkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hepsi</SelectItem>
                <SelectItem value="true">Öne Çıkan</SelectItem>
                <SelectItem value="false">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Magazine Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredMagazines.map((magazine: DigitalMagazine) => (
            <Card key={magazine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative">
                <img
                  src={magazine.coverImageUrl}
                  alt={magazine.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    Sayı {magazine.issueNumber}
                  </Badge>
                  {magazine.isFeatured && (
                    <Badge className="text-xs bg-yellow-500">
                      <LucideIcons.Star className="w-3 h-3 mr-1" />
                      Öne Çıkan
                    </Badge>
                  )}
                  {magazine.isPublished ? (
                    <Badge className="text-xs bg-green-500">Yayınlandı</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Taslak</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{magazine.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(magazine.publishDate)}
                  </p>
                  {magazine.category && (
                    <Badge variant="outline" className="text-xs">
                      {magazine.category}
                    </Badge>
                  )}
                </div>
                {magazine.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {magazine.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {magazine.pdfUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={magazine.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <LucideIcons.Download className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">PDF</span>
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handlePreviewMagazine(magazine)}>
                      <LucideIcons.Eye className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Görüntüle</span>
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <LucideIcons.MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMagazine(magazine)}>
                        <LucideIcons.Edit className="w-4 h-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteMagazine(magazine.id)}>
                        <LucideIcons.Trash className="w-4 h-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dergi Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMagazines.map((magazine: DigitalMagazine) => (
                <div key={magazine.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-24 sm:w-20 sm:h-30 flex-shrink-0">
                    <img
                      src={magazine.coverImageUrl}
                      alt={magazine.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{magazine.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            Sayı {magazine.issueNumber}
                          </Badge>
                          {magazine.category && (
                            <Badge variant="outline" className="text-xs">
                              {magazine.category}
                            </Badge>
                          )}
                          {magazine.isFeatured && (
                            <Badge className="text-xs bg-yellow-500">
                              <LucideIcons.Star className="w-3 h-3 mr-1" />
                              Öne Çıkan
                            </Badge>
                          )}
                          {magazine.isPublished ? (
                            <Badge className="text-xs bg-green-500">Yayınlandı</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Taslak</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDate(magazine.publishDate)}
                        </p>
                        {magazine.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {magazine.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" onClick={() => handlePreviewMagazine(magazine)}>
                          <LucideIcons.Eye className="w-4 h-4 mr-1" />
                          Görüntüle
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <LucideIcons.MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditMagazine(magazine)}>
                              <LucideIcons.Edit className="w-4 h-4 mr-2" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMagazine(magazine.id)}>
                              <LucideIcons.Trash className="w-4 h-4 mr-2" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Magazine Creation/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>
              {selectedMagazine ? 'Dergiyi Düzenle' : 'Yeni Dergi'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dergi Başlığı</FormLabel>
                      <FormControl>
                        <Input placeholder="Dergi başlığı..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sayı Numarası</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cilt Numarası (İsteğe Bağlı)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yayın Tarihi</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiyat (TL)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapak Görseli</FormLabel>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <Input
                            placeholder="Kapak görseli yükleyin veya URL girin..."
                            {...field}
                            className="flex-1 min-w-0"
                          />
                          <label htmlFor="cover-upload" className="flex-shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingCover}
                              className="cursor-pointer w-full sm:w-auto"
                              asChild
                            >
                              <span>
                                {uploadingCover ? (
                                  <>
                                    <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    <span className="hidden sm:inline">Yükleniyor...</span>
                                  </>
                                ) : (
                                  <>
                                    <LucideIcons.Upload className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Kapak Seç</span>
                                    <span className="sm:hidden">Kapak Seç</span>
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                          <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCoverUpload(file);
                            }}
                          />
                        </div>
                        {field.value && (
                          <div className="relative w-24 h-36 sm:w-32 sm:h-48 border rounded-lg overflow-hidden">
                            <img
                              src={field.value}
                              alt="Kapak önizleme"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 p-0"
                              onClick={() => field.onChange('')}
                            >
                              <LucideIcons.X className="w-2 h-2 sm:w-3 sm:h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pdfUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Dosyası (İsteğe Bağlı)</FormLabel>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <Input
                            placeholder="PDF dosyası yükleyin veya URL girin..."
                            {...field}
                            className="flex-1 min-w-0"
                          />
                          <label htmlFor="pdf-upload" className="flex-shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingPdf}
                              className="cursor-pointer w-full sm:w-auto"
                              asChild
                            >
                              <span>
                                {uploadingPdf ? (
                                  <>
                                    <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    <span className="hidden sm:inline">Yükleniyor...</span>
                                  </>
                                ) : (
                                  <>
                                    <LucideIcons.FileText className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">PDF Seç</span>
                                    <span className="sm:hidden">PDF Seç</span>
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                          <input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePdfUpload(file);
                            }}
                          />
                        </div>
                        {field.value && (
                          <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                            <LucideIcons.FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm flex-1 truncate">PDF yüklendi</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => field.onChange('')}
                            >
                              <LucideIcons.X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
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
                    <FormLabel>Açıklama (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dergi hakkında açıklama..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiketler (virgülle ayırın)</FormLabel>
                    <FormControl>
                      <Input placeholder="teknoloji, yaşam, gelecek" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Yayınla</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Dergiyi hemen yayınlamak için aktifleştirin
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

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Öne Çıkar</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Dergiyi öne çıkan dergiler arasında göster
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

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto"
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMagazineMutation.isPending || updateMagazineMutation.isPending || uploadingCover || uploadingPdf}
                  className="w-full sm:w-auto"
                >
                  {(createMagazineMutation.isPending || updateMagazineMutation.isPending) ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dergi Önizleme Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>{previewMagazine?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img
                src={previewMagazine?.coverImageUrl}
                alt={previewMagazine?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md">
                Sayı {previewMagazine?.issueNumber}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{previewMagazine?.title}</h3>
              <p className="text-sm text-muted-foreground">
                Yayın Tarihi: {formatDate(previewMagazine?.publishDate || '')}
              </p>
              <p className="text-sm text-muted-foreground">
                Kategori: {previewMagazine?.category || 'Belirtilmemiş'}
              </p>
              <p className="text-sm text-muted-foreground">
                Dil: {previewMagazine?.language || 'Türkçe'}
              </p>
              <p className="text-sm text-muted-foreground">
                Fiyat: {previewMagazine?.price || '0.00'} TL
              </p>
              <div className="flex items-center space-x-2">
                {previewMagazine?.pdfUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={previewMagazine.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <LucideIcons.Download className="w-4 h-4 mr-1" />
                      PDF İndir
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => window.open(previewMagazine?.coverImageUrl, '_blank')}>
                  <LucideIcons.Eye className="w-4 h-4 mr-1" />
                  Kapak Görüntüle
                </Button>
              </div>
              {previewMagazine?.description && (
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Açıklama</h4>
                  <p className="text-sm text-muted-foreground">{previewMagazine.description}</p>
                </div>
              )}
              {previewMagazine?.tags && previewMagazine.tags.length > 0 && (
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Etiketler</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {previewMagazine.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}