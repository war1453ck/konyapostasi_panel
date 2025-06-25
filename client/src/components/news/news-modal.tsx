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
import { insertNewsSchema, type InsertNews, type News } from '@/../../shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/rich-text-editor';
import { FileUpload } from '@/components/file-upload';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news?: News;
}

type FormData = InsertNews;

export function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertNewsSchema.extend({
      slug: insertNewsSchema.shape.slug.optional(),
    })),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      categoryId: undefined,
      status: 'draft',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      authorId: 1,
      keywords: '',
      cityId: undefined,
      sourceId: undefined,
      editorId: undefined,
      videoUrl: '',
      videoThumbnail: '',
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isOpen,
  });

  // Fetch cities
  const { data: cities = [] } = useQuery({
    queryKey: ['/api/cities'],
    enabled: isOpen,
  });

  // Fetch sources
  const { data: sources = [] } = useQuery({
    queryKey: ['/api/sources/active'],
    enabled: isOpen,
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: InsertNews) => {
      const url = news ? `/api/news/${news.id}` : '/api/news';
      const method = news ? 'PATCH' : 'POST';
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: news ? 'Haber güncellendi' : 'Haber oluşturuldu',
        description: news ? 'Haber başarıyla güncellendi.' : 'Yeni haber başarıyla oluşturuldu.',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertNews) => {
    console.log('Form verisi:', data);
    createNewsMutation.mutate(data);
  };

  // Form reset when news prop changes
  useEffect(() => {
    if (news) {
      form.reset({
        title: news.title || '',
        slug: news.slug || '',
        summary: news.summary || '',
        content: news.content || '',
        categoryId: news.categoryId || undefined,
        status: news.status || 'draft',
        featuredImage: news.featuredImage || '',
        metaTitle: news.metaTitle || '',
        metaDescription: news.metaDescription || '',
        authorId: news.authorId || 1,
        keywords: news.keywords || '',
        cityId: news.cityId || undefined,
        sourceId: news.sourceId || undefined,
        editorId: news.editorId || undefined,
        videoUrl: news.videoUrl || '',
        videoThumbnail: news.videoThumbnail || '',
      });
    } else if (isOpen) {
      form.reset({
        title: '',
        slug: '',
        summary: '',
        content: '',
        categoryId: undefined,
        status: 'draft',
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        authorId: 1,
        keywords: '',
        cityId: undefined,
        sourceId: undefined,
        editorId: undefined,
        videoUrl: '',
        videoThumbnail: '',
      });
    }
  }, [news, isOpen, form]);

  // Slug otomatik oluşturma
  const title = form.watch('title');
  useEffect(() => {
    if (title && !news) {
      const slug = title
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  }, [title, form, news]);

  const handleStatusSubmit = (status: 'published' | 'review' | 'draft') => {
    const currentData = form.getValues();
    const dataWithStatus = {
      ...currentData,
      status,
      publishedAt: status === 'published' ? new Date() : null,
    };
    onSubmit(dataWithStatus);
  };

  const publish = () => handleStatusSubmit('published');
  const submitForReview = () => handleStatusSubmit('review');
  const saveAsDraft = () => handleStatusSubmit('draft');

  // Form submit handler
  const handleFormSubmit = () => {
    form.handleSubmit((data) => {
      console.log('Form submit çağrıldı:', data);
      onSubmit(data);
    })();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100vw] h-[100vh] sm:w-[95vw] sm:max-w-4xl sm:h-[90vh] max-h-screen p-0 sm:p-6 sm:rounded-lg rounded-none overflow-hidden">
        <DialogHeader className="px-4 py-4 sm:px-6 border-b bg-background">
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {news ? 'Haberi Düzenle' : 'Yeni Haber Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <div className="h-full overflow-y-auto px-4 py-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 sm:space-y-6">
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
                          <Input placeholder="Haber başlığını girin..." {...field} className="h-11" />
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
                        <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="url-slug" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Özet</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Haber özeti..."
                            className="min-h-[80px] resize-none"
                            value={value || ''}
                            onChange={onChange}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Kategori seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(categories as any[]).map((category) => (
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

                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Şehir</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Şehir seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(cities as any[]).map((city) => (
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="sourceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Kaynak</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Kaynak seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(sources as any[]).map((source) => (
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

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Durum</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Durum seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Taslak</SelectItem>
                              <SelectItem value="review">İnceleme</SelectItem>
                              <SelectItem value="published">Yayınlandı</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  </CardContent>
                </Card>

                {/* İçerik */}
                <Card>
                  <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">İçerik</h3>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Haber İçeriği</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Haber içeriğini yazın..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Medya */}
                <Card>
                  <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Medya</h3>
                    
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Öne Çıkan Görsel</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value || ''}
                              onChange={field.onChange}
                              accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                              }}
                              maxSize={5 * 1024 * 1024} // 5MB
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Video URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://..." 
                                value={value || ''}
                                onChange={onChange}
                                {...field}
                                className="h-11" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videoThumbnail"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Video Thumbnail URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://..." 
                                value={value || ''}
                                onChange={onChange}
                                {...field}
                                className="h-11" 
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
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">SEO</h3>
                    
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Meta Başlık</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="SEO başlığı..." 
                              value={value || ''}
                              onChange={onChange}
                              {...field}
                              className="h-11" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Meta Açıklama</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="SEO açıklaması..."
                              className="min-h-[80px] resize-none"
                              value={value || ''}
                              onChange={onChange}
                              {...field}
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
                            <Input
                              placeholder="anahtar1, anahtar2, anahtar3..."
                              {...field}
                              value={field.value || ''}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-background border-t p-4 sm:p-6 mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="order-3 sm:order-1 h-11"
                >
                  İptal
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto order-1 sm:order-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveAsDraft}
                    disabled={createNewsMutation.isPending}
                    className="h-11"
                  >
                    Taslak Kaydet
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={submitForReview}
                    disabled={createNewsMutation.isPending}
                    className="h-11"
                  >
                    İncelemeye Gönder
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={publish}
                    disabled={createNewsMutation.isPending}
                    className="h-11"
                  >
                    {createNewsMutation.isPending ? 'Kaydediliyor...' : 'Yayınla'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}