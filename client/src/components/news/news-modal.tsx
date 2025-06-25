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
      const payload = {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null,
      };
      
      if (news) {
        return await apiRequest('PUT', `/api/news/${news.id}`, payload);
      } else {
        return await apiRequest('POST', '/api/news', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Başarılı',
        description: news ? 'Haber güncellendi' : 'Haber oluşturuldu',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Haber kaydetme hatası:', error);
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
    form.setValue('status', 'published');
    form.setValue('publishedAt', new Date().toISOString());
    form.handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {news ? 'Haberi Düzenle' : 'Yeni Haber Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">İçerik</TabsTrigger>
                <TabsTrigger value="media">Medya</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Haber Başlığı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Haber başlığını girin..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
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

                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şehir</FormLabel>
                        <Select value={field.value?.toString() || "none"} onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Şehir seçin..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                    name="editorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Editör</FormLabel>
                        <Select value={field.value?.toString() || "none"} onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Editör seçin..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Editör Atanmadı</SelectItem>
                            <SelectItem value="1">Admin User</SelectItem>
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
                        <FormLabel>Haber Kaynağı</FormLabel>
                        <Select value={field.value?.toString() || "none"} onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Kaynak seçin..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                      <FormLabel>Özet</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Haber özeti..."
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İçerik</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Haber içeriğini yazın..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yayın Durumu</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
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
                          <FormLabel>Yayın Tarihi</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="featuredImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kapak Görseli</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <Input
                                  placeholder="Görsel URL'si girin..."
                                  {...field}
                                />
                                <FileUpload
                                  onFileUpload={(files) => {
                                    console.log('Files uploaded:', files);
                                  }}
                                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                                  maxFiles={1}
                                  className="border-dashed"
                                />
                                {field.value && (
                                  <div className="relative">
                                    <img
                                      src={field.value}
                                      alt="Kapak görseli"
                                      className="max-w-full h-40 object-cover rounded-lg"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-2 right-2"
                                      onClick={() => field.onChange('')}
                                    >
                                      Kaldır
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video URL (YouTube)</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <Input
                                  placeholder="YouTube video URL'si girin... (örn: https://www.youtube.com/watch?v=VIDEO_ID)"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Auto-generate thumbnail when YouTube URL is entered
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
                                  <div className="space-y-2">
                                    <p className="text-sm text-green-600">✓ Geçerli YouTube URL'si</p>
                                    <div className="p-3 bg-muted rounded-lg">
                                      <p className="text-sm font-medium mb-2">Embed Kodu:</p>
                                      <code className="text-xs bg-background p-2 rounded block overflow-x-auto">
                                        {generateYouTubeEmbedCode(field.value)}
                                      </code>
                                    </div>
                                    {getYouTubeThumbnail(field.value) && (
                                      <div className="flex items-center space-x-2">
                                        <img 
                                          src={getYouTubeThumbnail(field.value)!} 
                                          alt="Video thumbnail" 
                                          className="w-16 h-12 object-cover rounded"
                                        />
                                        <span className="text-sm text-muted-foreground">Otomatik küçük resim</span>
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
                            <FormLabel>Video Küçük Resmi</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Video küçük resmi URL'si (otomatik doldurulur)..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Başlık</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO başlığı..." {...field} />
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
                          <FormLabel>Meta Açıklama</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="SEO açıklaması..."
                              rows={2}
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
                          <FormLabel>Anahtar Kelimeler</FormLabel>
                          <FormControl>
                            <Input placeholder="anahtar, kelime, listesi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={saveAsDraft}
                disabled={createNewsMutation.isPending}
              >
                Taslak Kaydet
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={submitForReview}
                disabled={createNewsMutation.isPending}
              >
                İncelemeye Gönder
              </Button>
              <Button
                type="button"
                onClick={publish}
                disabled={createNewsMutation.isPending}
              >
                {createNewsMutation.isPending ? 'Kaydediliyor...' : 'Yayınla'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
