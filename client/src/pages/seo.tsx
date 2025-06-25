import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { NewsWithDetails } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function SEO() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: news = [], isLoading } = useQuery<NewsWithDetails[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news', { credentials: 'include' });
      if (!response.ok) throw new Error('Haberler yüklenemedi');
      return response.json();
    }
  });

  const getSEOScore = (newsItem: NewsWithDetails) => {
    let score = 0;
    const checks = {
      title: newsItem.title && newsItem.title.length >= 30 && newsItem.title.length <= 60,
      metaTitle: newsItem.metaTitle && newsItem.metaTitle.length >= 30 && newsItem.metaTitle.length <= 60,
      metaDescription: newsItem.metaDescription && newsItem.metaDescription.length >= 120 && newsItem.metaDescription.length <= 160,
      keywords: newsItem.keywords && newsItem.keywords.split(',').length >= 3,
      slug: newsItem.slug && newsItem.slug.length <= 100,
      content: newsItem.content && newsItem.content.length >= 300
    };

    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    return Math.round((score / Object.keys(checks).length) * 100);
  };

  const getSEOBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Mükemmel</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">İyi</Badge>;
    if (score >= 40) return <Badge className="bg-orange-500">Orta</Badge>;
    return <Badge variant="destructive">Zayıf</Badge>;
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const seoIssues = news.filter(item => getSEOScore(item) < 60);
  const averageScore = news.length > 0 
    ? Math.round(news.reduce((sum, item) => sum + getSEOScore(item), 0) / news.length) 
    : 0;

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">SEO Araçları</h1>
          <p className="text-sm sm:text-base text-muted-foreground">İçeriklerinizin SEO performansını analiz edin</p>
        </div>
      </div>

      {/* SEO Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <LucideIcons.TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ortalama SEO Skoru</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <LucideIcons.AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">SEO Sorunları</p>
                <p className="text-2xl font-bold">{seoIssues.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <LucideIcons.CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Optimize Edilmiş</p>
                <p className="text-2xl font-bold">{news.filter(item => getSEOScore(item) >= 80).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">SEO Analizi</TabsTrigger>
          <TabsTrigger value="suggestions">Öneriler</TabsTrigger>
          <TabsTrigger value="tools">SEO Araçları</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>İçerik SEO Analizi</CardTitle>
                <Input
                  placeholder="Haber ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table className="responsive-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>SEO Skoru</TableHead>
                    <TableHead>Meta Başlık</TableHead>
                    <TableHead>Meta Açıklama</TableHead>
                    <TableHead>Anahtar Kelimeler</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <LucideIcons.Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          Haber bulunamadı
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNews.map((item) => {
                      const score = getSEOScore(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{score}%</span>
                              {getSEOBadge(score)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {item.metaTitle ? (
                                <LucideIcons.Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <LucideIcons.X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="ml-1 text-sm">
                                {item.metaTitle ? `${item.metaTitle.length} karakter` : 'Eksik'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {item.metaDescription ? (
                                <LucideIcons.Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <LucideIcons.X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="ml-1 text-sm">
                                {item.metaDescription ? `${item.metaDescription.length} karakter` : 'Eksik'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {item.keywords ? (
                                <LucideIcons.Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <LucideIcons.X className="w-4 h-4 text-red-500" />
                              )}
                              <span className="ml-1 text-sm">
                                {item.keywords ? `${item.keywords.split(',').length} anahtar` : 'Eksik'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                              {item.status === 'published' ? 'Yayında' : 'Taslak'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LucideIcons.AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  SEO Sorunları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seoIssues.length === 0 ? (
                  <p className="text-muted-foreground">Harika! Tüm içerikleriniz SEO açısından optimize edilmiş.</p>
                ) : (
                  seoIssues.slice(0, 5).map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        SEO Skoru: {getSEOScore(item)}% - Optimizasyon gerekli
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LucideIcons.Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                  SEO Önerileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-sm">Meta Başlık Optimizasyonu</h4>
                  <p className="text-xs text-muted-foreground">30-60 karakter arası meta başlık kullanın</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <h4 className="font-medium text-sm">Meta Açıklama</h4>
                  <p className="text-xs text-muted-foreground">120-160 karakter arası açıklama yazın</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <h4 className="font-medium text-sm">Anahtar Kelimeler</h4>
                  <p className="text-xs text-muted-foreground">En az 3 anahtar kelime hedefleyin</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <h4 className="font-medium text-sm">İçerik Uzunluğu</h4>
                  <p className="text-xs text-muted-foreground">Minimum 300 kelime içerik oluşturun</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Meta Başlık Kontrol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Meta başlığınızı girin..." />
                <div className="text-sm text-muted-foreground">
                  Karakter sayısı: 0/60
                </div>
                <Button>Analiz Et</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Açıklama Kontrol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Meta açıklamanızı girin..." rows={3} />
                <div className="text-sm text-muted-foreground">
                  Karakter sayısı: 0/160
                </div>
                <Button>Analiz Et</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anahtar Kelime Yoğunluğu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Anahtar kelime girin..." />
                <Textarea placeholder="İçeriğinizi buraya yapıştırın..." rows={4} />
                <Button>Yoğunluğu Hesapla</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URL Slug Oluşturucu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Başlık girin..." />
                <Input placeholder="Oluşturulan slug..." readOnly className="bg-muted" />
                <Button>Slug Oluştur</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
