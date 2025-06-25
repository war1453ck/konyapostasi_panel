import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor';
import { FileUpload } from '@/components/file-upload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertNewsSchema } from '@shared/schema';
import type { NewsWithDetails, Category } from '@shared/schema';
import { isValidYouTubeUrl, getYouTubeEmbedUrl, generateYouTubeEmbedCode, getYouTubeThumbnail } from '@/lib/youtube';
import { z } from 'zod';

const newsFormSchema = insertNewsSchema.extend({
  scheduledAt: z.string().optional(),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news?: NewsWithDetails | null;
}

export function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: news?.title || '',
      slug: news?.slug || '',
      summary: news?.summary || '',
      content: news?.content || '',
      featuredImage: news?.featuredImage || '',
      videoUrl: news?.videoUrl || '',
      videoThumbnail: news?.videoThumbnail || '',
      source: news?.source || '',
      sourceId: news?.sourceId || undefined,
      status: news?.status || 'draft',
      authorId: news?.authorId || 1,
      editorId: news?.editorId || undefined,
      categoryId: news?.categoryId || 1,
      cityId: news?.cityId || undefined,
      metaTitle: news?.metaTitle || '',
      metaDescription: news?.metaDescription || '',
      keywords: news?.keywords || '',
      scheduledAt: news?.scheduledAt ? new Date(news.scheduledAt).toISOString().slice(0, 16) : '',
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) throw new Error('Kategoriler yüklenemedi');
      return response.json();
    }
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['/api/cities'],
    queryFn: async () => {
      const response = await fetch('/api/cities', { credentials: 'include' });
      if (!response.ok) return [];
      return response.json();
    }
  });

  const { data: sources = [] } = useQuery({
    queryKey: ['/api/sources/active'],
    queryFn: async () => {
      const response = await fetch('/api/sources/active', { credentials: 'include' });
      if (!response.ok) return [];
      return response.json();
    }
  });

  useEffect(() => {
    if (news) {
      form.reset({
        title: news.title,
        slug: news.slug,
        summary: news.summary || '',
        content: news.content,
        status: news.status,
        categoryId: news.categoryId,
        authorId: news.authorId,
        editorId: news.editorId || undefined,
        cityId: news.cityId || undefined,
        source: news.source || '',
        sourceId: news.sourceId || undefined,
        videoUrl: news.videoUrl || '',
        videoThumbnail: news.videoThumbnail || '',
        featuredImage: news.featuredImage || '',
        metaTitle: news.metaTitle || '',
        metaDescription: news.metaDescription || '',
        keywords: news.keywords || '',
        scheduledAt: news.scheduledAt ? new Date(news.scheduledAt).toISOString().slice(0, 16) : undefined,
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        summary: '',
        content: '',
        status: 'draft',
        categoryId: 0,
        authorId: 1,
        editorId: undefined,
        cityId: undefined,
        source: '',
        sourceId: undefined,
        videoUrl: '',
        videoThumbnail: '',
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        scheduledAt: undefined,
      });
    }
  }, [news, form]);

  const createNewsMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      console.log('Mutation başlıyor, data:', data);
      const payload = {
        ...data,
        sourceId: data.sourceId || null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null,
      };
      console.log('API\'ye gönderilecek payload:', payload);
      
      let response;
      if (news) {
        console.log('Haber güncelleniyor, ID:', news.id);
        response = await apiRequest('PUT', `/api/news/${news.id}`, payload);
      } else {
        console.log('Yeni haber oluşturuluyor');
        response = await apiRequest('POST', '/api/news', payload);
      }
      console.log('API response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Mutation başarılı:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Başarılı',
        description: news ? 'Haber güncellendi' : 'Haber oluşturuldu',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Mutation hatası:', error);
      console.error('Hata detayları:', error.response, error.message);
      toast({
        title: 'Hata',
        description: error?.message || 'Haber kaydedilirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const generateSlug = (title: string) => {
    return title
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

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!news) {
      form.setValue('slug', generateSlug(title));
      form.setValue('metaTitle', title);
    }
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      // In a real app, you would upload the file and get a URL back
      const fakeUrl = URL.createObjectURL(files[0]);
      form.setValue('featuredImage', fakeUrl);
      toast({
        title: 'Dosya yüklendi',
        description: 'Görsel başarıyla yüklendi',
      });
    }
  };

  const onSubmit = (data: NewsFormData) => {
    console.log('Form data gönderiliyor:', data);
    console.log('Form validation errors:', form.formState.errors);
    createNewsMutation.mutate(data);
  };

  const saveAsDraft = () => {
    form.setValue('status', 'draft');
    form.handleSubmit(onSubmit)();
  };

  const submitForReview = () => {
    form.setValue('status', 'review');
    form.handleSubmit(onSubmit)();
  };

  const publish = () => {
    console.log('Yayınla butonuna tıklandı');
    form.setValue('status', 'published');
    const formData = form.getValues();
    console.log('Form verileri:', formData);
    form.handleSubmit((data) => {
      console.log('Form submit çağrıldı:', data);
      onSubmit(data);
    })();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100vw] h-[100vh] sm:w-[95vw] sm:max-w-4xl sm:h-[90vh] max-h-screen overflow-y-auto p-3 sm:p-6 sm:rounded-lg rounded-none">
        <DialogHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {news ? 'Haberi Düzenle' : 'Yeni Haber Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 pt-4">
            <div className="space-y-4 sm:space-y-8">
              {/* Temel Bilgiler */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Temel Bilgiler</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Haber Başlığı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Haber başlığını girin..."
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
                            className="text-base h-12"
                            autoComplete="off"
                            autoCapitalize="sentences"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="url-slug" {...field} value={field.value || ''} className="text-base h-12" />
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
                          <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                          <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Kategori seçin..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Şehir</FormLabel>
                          <Select value={field.value?.toString() || "none"} onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Şehir seçin..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              <SelectItem value="none">Şehir Seçilmedi</SelectItem>
                              {cities.map((city: any) => (
                                <SelectItem key={city.id} value={city.id.toString()}>
                                  {city.name}
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
                      name="sourceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Haber Kaynağı</FormLabel>
                          <Select value={field.value?.toString() || "none"} onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Kaynak seçin..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              <SelectItem value="none">Kaynak Seçilmedi</SelectItem>
                              {sources.map((source: any) => (
                                <SelectItem key={source.id} value={source.id.toString()}>
                                  {source.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Özet</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Haber özeti..."
                            rows={3}
                            {...field}
                            value={field.value || ''}
                            className="text-base resize-none min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* İçerik */}
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">İçerik</h3>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="min-h-[200px] sm:min-h-[300px]">
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Haber içeriğini yazın..."
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Medya */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Medya</h3>
                  
                  {/* Kapak Görseli */}
                  <div className="space-y-3 sm:space-y-4">
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Kapak Görseli</FormLabel>
                          <FormControl>
                            <div className="space-y-3 sm:space-y-4">
                              <Input
                                placeholder="Görsel URL'si girin..."
                                {...field}
                                value={field.value || ''}
                                className="text-base h-12"
                              />
                              <FileUpload
                                onFileUpload={(files) => {
                                  console.log('Files uploaded:', files);
                                }}
                                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                                maxFiles={1}
                                className="border-dashed min-h-[100px] sm:min-h-[120px] text-sm"
                              />
                              {field.value && (
                                <div className="relative">
                                  <img
                                    src={field.value}
                                    alt="Kapak görseli"
                                    className="max-w-full h-32 sm:h-40 object-cover rounded-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                    onClick={() => field.onChange('')}
                                  >
                                    ×
                                  </Button>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Video */}
                  <div className="space-y-3 sm:space-y-4">
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Video URL (YouTube)</FormLabel>
                          <FormControl>
                            <div className="space-y-3 sm:space-y-4">
                              <Input
                                placeholder="YouTube video URL'si girin..."
                                {...field}
                                value={field.value || ''}
                                className="text-base h-12"
                                onChange={(e) => {
                                  field.onChange(e);
                                  const url = e.target.value;
                                  if (isValidYouTubeUrl(url)) {
                                    const thumbnail = getYouTubeThumbnail(url);
                                    if (thumbnail) {
                                      form.setValue('videoThumbnail', thumbnail);
                                    }
                                  }
                                }}
                              />
                              {field.value && isValidYouTubeUrl(field.value) && (
                                <div className="space-y-2 sm:space-y-3">
                                  <p className="text-sm text-green-600 font-medium">✓ Geçerli YouTube URL'si</p>
                                  {getYouTubeThumbnail(field.value) && (
                                    <div className="flex items-center space-x-3">
                                      <img 
                                        src={getYouTubeThumbnail(field.value)!} 
                                        alt="Video thumbnail" 
                                        className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded"
                                      />
                                      <span className="text-xs sm:text-sm text-muted-foreground">Otomatik küçük resim</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {field.value && !isValidYouTubeUrl(field.value) && (
                                <p className="text-sm text-red-600">❌ Geçersiz YouTube URL'si</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="videoThumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Video Küçük Resmi</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Video küçük resmi URL'si (otomatik doldurulur)..."
                              {...field}
                              value={field.value || ''}
                              className="text-base h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">SEO Ayarları</h3>
                  
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Meta Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="SEO başlığı..." {...field} value={field.value || ''} className="text-base h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Meta Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="SEO açıklaması..."
                            rows={2}
                            {...field}
                            value={field.value || ''}
                            className="text-base resize-none min-h-[60px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Anahtar Kelimeler</FormLabel>
                        <FormControl>
                          <Input placeholder="anahtar, kelime, listesi" {...field} value={field.value || ''} className="text-base h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Yayın Ayarları */}
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Yayın Ayarları</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Yayın Durumu</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Taslak</SelectItem>
                              <SelectItem value="review">İncelemede</SelectItem>
                              <SelectItem value="published">Yayında</SelectItem>
                              <SelectItem value="scheduled">Programlı</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('status') === 'scheduled' && (
                      <FormField
                        control={form.control}
                        name="scheduledAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Yayın Tarihi</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} className="h-12 text-base" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4 pb-2 -mx-3 sm:-mx-6 px-3 sm:px-6 mt-6">
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="w-full sm:w-auto order-4 sm:order-1 h-12 text-base"
                >
                  İptal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveAsDraft}
                  disabled={createNewsMutation.isPending}
                  className="w-full sm:w-auto order-3 sm:order-2 h-12 text-base"
                >
                  {createNewsMutation.isPending ? 'Kaydediliyor...' : 'Taslak Kaydet'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={submitForReview}
                  disabled={createNewsMutation.isPending}
                  className="w-full sm:w-auto order-2 sm:order-3 h-12 text-base"
                >
                  {createNewsMutation.isPending ? 'Kaydediliyor...' : 'İncelemeye Gönder'}
                </Button>
                <Button
                  type="button"
                  onClick={publish}
                  disabled={createNewsMutation.isPending}
                  className="w-full sm:w-auto order-1 sm:order-4 h-12 text-base font-semibold"
                >
                  {createNewsMutation.isPending ? 'Kaydediliyor...' : 'Yayınla'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
