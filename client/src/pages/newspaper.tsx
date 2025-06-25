import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NewspaperPage, InsertNewspaperPage } from '@shared/schema';

const newspaperPageSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  pageNumber: z.number().min(1, 'Sayfa numarası 1 veya daha büyük olmalıdır'),
  issueDate: z.string().min(1, 'Yayın tarihi gereklidir'),
  imageUrl: z.string().min(1, 'Sayfa görseli gereklidir'),
  pdfUrl: z.string().optional().or(z.literal('')),
  description: z.string().optional(),
  edition: z.string().optional(),
  language: z.string().default('tr'),
  isActive: z.boolean().default(true),
});

type NewspaperPageFormData = z.infer<typeof newspaperPageSchema>;

export default function Newspaper() {
  const [filters, setFilters] = useState({
    search: '',
    date: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<NewspaperPage | null>(null);
  const [viewerMode, setViewerMode] = useState<'grid' | 'viewer'>('grid');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NewspaperPageFormData>({
    resolver: zodResolver(newspaperPageSchema),
    defaultValues: {
      title: '',
      pageNumber: 1,
      issueDate: new Date().toISOString().split('T')[0],
      imageUrl: '',
      pdfUrl: '',
      description: '',
      edition: '',
      language: 'tr',
      isActive: true,
    },
  });

  const { data: pages = [], isLoading } = useQuery<NewspaperPage[]>({
    queryKey: ['/api/newspaper-pages'],
    queryFn: async () => {
      const response = await fetch('/api/newspaper-pages');
      if (!response.ok) throw new Error('Gazete sayfaları yüklenemedi');
      return response.json();
    }
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: NewspaperPageFormData) => {
      return apiRequest('/api/newspaper-pages', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          issueDate: new Date(data.issueDate).toISOString(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newspaper-pages'] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Gazete sayfası başarıyla eklendi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Gazete sayfası eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/newspaper-pages/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newspaper-pages'] });
      toast({
        title: 'Başarılı',
        description: 'Gazete sayfası başarıyla silindi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Gazete sayfası silinirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         page.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDate = !filters.date || new Date(page.issueDate).toDateString() === new Date(filters.date).toDateString();
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCreatePage = () => {
    setSelectedPage(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditPage = (page: NewspaperPage) => {
    setSelectedPage(page);
    form.reset({
      title: page.title,
      pageNumber: page.pageNumber,
      issueDate: new Date(page.issueDate).toISOString().split('T')[0],
      imageUrl: page.imageUrl,
      pdfUrl: page.pdfUrl || '',
      description: page.description || '',
      edition: page.edition || '',
      language: page.language || 'tr',
      isActive: page.isActive,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
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
      form.setValue('imageUrl', result.url);
      
      toast({
        title: 'Başarılı',
        description: 'Görsel başarıyla yüklendi',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Görsel yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
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

  const handleDeletePage = (id: number) => {
    if (confirm('Bu gazete sayfasını silmek istediğinizden emin misiniz?')) {
      deletePageMutation.mutate(id);
    }
  };

  const onSubmit = (data: NewspaperPageFormData) => {
    createPageMutation.mutate(data);
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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dijital Gazete</h1>
          <p className="text-muted-foreground">Yerel gazetenizin sayfalarını yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setViewerMode(viewerMode === 'grid' ? 'viewer' : 'grid')}>
            {viewerMode === 'grid' ? (
              <>
                <LucideIcons.BookOpen className="w-4 h-4 mr-2" />
                Gazete Görünümü
              </>
            ) : (
              <>
                <LucideIcons.Grid className="w-4 h-4 mr-2" />
                Liste Görünümü
              </>
            )}
          </Button>
          <Button onClick={handleCreatePage}>
            <LucideIcons.Plus className="w-4 h-4 mr-2" />
            Yeni Sayfa
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sayfa</CardTitle>
            <LucideIcons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Sayfalar</CardTitle>
            <LucideIcons.Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.filter(page => 
                new Date(page.issueDate).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
            <LucideIcons.Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.filter(page => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(page.issueDate) >= weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Sayfalar</CardTitle>
            <LucideIcons.Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter(page => page.isActive).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Sayfa ara..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-64"
            />
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {viewerMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPages.map((page) => (
            <Card key={page.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative">
                <img
                  src={page.imageUrl}
                  alt={page.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">
                    Sayfa {page.pageNumber}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{page.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(page.issueDate)}
                  </p>
                  {page.edition && (
                    <Badge variant="outline" className="text-xs">
                      {page.edition}
                    </Badge>
                  )}
                </div>
                {page.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {page.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {page.pdfUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={page.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <LucideIcons.Download className="w-3 h-3 mr-1" />
                          PDF
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => window.open(page.imageUrl, '_blank')}>
                      <LucideIcons.Eye className="w-3 h-3 mr-1" />
                      Görüntüle
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <LucideIcons.MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPage(page)}>
                        <LucideIcons.Edit className="w-4 h-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePage(page.id)}>
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
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-4xl font-bold mb-2">YEREL GAZETE</h1>
            <p className="text-lg">{formatDate(new Date())}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPages.slice(0, 6).map((page) => (
              <div key={page.id} className="space-y-4">
                <div className="aspect-[3/4] relative border rounded-lg overflow-hidden">
                  <img
                    src={page.imageUrl}
                    alt={page.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary">
                      Sayfa {page.pageNumber}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{page.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(page.issueDate)}
                    </p>
                    {page.edition && (
                      <Badge variant="outline" className="text-xs">
                        {page.edition}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Creation/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? 'Gazete Sayfasını Düzenle' : 'Yeni Gazete Sayfası'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input placeholder="Gazete sayfası başlığı..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sayfa Numarası</FormLabel>
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
                  name="issueDate"
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
                  name="edition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baskı/Sayı</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Sayı 145, Özel Baskı..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sayfa Görseli</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Input
                            placeholder="Görsel dosyası yükleyin veya URL girin..."
                            {...field}
                            className="flex-1"
                          />
                          <label htmlFor="image-upload">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingImage}
                              className="cursor-pointer"
                              asChild
                            >
                              <span>
                                {uploadingImage ? (
                                  <>
                                    <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Yükleniyor...
                                  </>
                                ) : (
                                  <>
                                    <LucideIcons.Upload className="w-4 h-4 mr-2" />
                                    Dosya Seç
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </div>
                        {field.value && (
                          <div className="relative w-32 h-40 border rounded-lg overflow-hidden">
                            <img
                              src={field.value}
                              alt="Önizleme"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 w-6 h-6 p-0"
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

                <FormField
                  control={form.control}
                  name="pdfUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Dosyası (İsteğe Bağlı)</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Input
                            placeholder="PDF dosyası yükleyin veya URL girin..."
                            {...field}
                            className="flex-1"
                          />
                          <label htmlFor="pdf-upload">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingPdf}
                              className="cursor-pointer"
                              asChild
                            >
                              <span>
                                {uploadingPdf ? (
                                  <>
                                    <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Yükleniyor...
                                  </>
                                ) : (
                                  <>
                                    <LucideIcons.FileText className="w-4 h-4 mr-2" />
                                    PDF Seç
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
                            <LucideIcons.FileText className="w-4 h-4" />
                            <span className="text-sm flex-1">PDF yüklendi</span>
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
                        placeholder="Bu sayfada neler var..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createPageMutation.isPending || uploadingImage || uploadingPdf}>
                  {createPageMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}