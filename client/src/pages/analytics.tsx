import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/stats-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { NewsWithDetails } from '@shared/schema';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7');

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats', { credentials: 'include' });
      if (!response.ok) throw new Error('İstatistikler yüklenemedi');
      return response.json();
    }
  });

  const { data: news = [] } = useQuery<NewsWithDetails[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news?status=published', { credentials: 'include' });
      if (!response.ok) throw new Error('Haberler yüklenemedi');
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) throw new Error('Kategoriler yüklenemedi');
      return response.json();
    }
  });

  const topNews = news
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10);

  const categoryStats = categories.map(category => ({
    ...category,
    newsCount: news.filter(n => n.categoryId === category.id).length,
    totalViews: news
      .filter(n => n.categoryId === category.id)
      .reduce((sum, n) => sum + n.viewCount, 0)
  }));

  const totalViews = news.reduce((sum, n) => sum + n.viewCount, 0);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Analitikler</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Platform performansını takip edin</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Son 24 Saat</SelectItem>
              <SelectItem value="7">Son 7 Gün</SelectItem>
              <SelectItem value="30">Son 30 Gün</SelectItem>
              <SelectItem value="90">Son 3 Ay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <LucideIcons.Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Rapor İndir</span>
            <span className="sm:hidden">İndir</span>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Toplam Görüntülenme"
          value={totalViews.toLocaleString('tr-TR')}
          change="%15 artış"
          changeType="increase"
          icon={<LucideIcons.Eye className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatsCard
          title="Yayınlanan Haber"
          value={news.length}
          change="%8 artış"
          changeType="increase"
          icon={<LucideIcons.Newspaper className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900"
        />
        <StatsCard
          title="Ortalama Okunma"
          value={news.length > 0 ? Math.round(totalViews / news.length) : 0}
          change="%12 artış"
          changeType="increase"
          icon={<LucideIcons.TrendingUp className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100 dark:bg-purple-900"
        />
        <StatsCard
          title="Aktif Kategoriler"
          value={categoryStats.filter(c => c.newsCount > 0).length}
          change="%3 artış"
          changeType="increase"
          icon={<LucideIcons.Tags className="w-6 h-6 text-orange-600" />}
          iconBgColor="bg-orange-100 dark:bg-orange-900"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing News */}
        <Card>
          <CardHeader>
            <CardTitle>En Çok Okunan Haberler</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Görüntülenme</TableHead>
                  <TableHead>Kategori</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topNews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      <span className="text-muted-foreground">Veri bulunamadı</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  topNews.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">#{index + 1}</span>
                          <span className="text-sm truncate max-w-[200px]">{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <LucideIcons.Eye className="w-4 h-4 mr-1" />
                          {item.viewCount.toLocaleString('tr-TR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category.name}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Performansı</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Haber Sayısı</TableHead>
                  <TableHead>Toplam Görüntülenme</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      <span className="text-muted-foreground">Veri bulunamadı</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  categoryStats
                    .sort((a, b) => b.totalViews - a.totalViews)
                    .map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <LucideIcons.FileText className="w-4 h-4 mr-1" />
                            {category.newsCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <LucideIcons.Eye className="w-4 h-4 mr-1" />
                            {category.totalViews.toLocaleString('tr-TR')}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mock Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Günlük Görüntülenme Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <LucideIcons.BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Grafik entegrasyonu için Chart.js kullanılabilir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <LucideIcons.PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Pasta grafik entegrasyonu için Chart.js kullanılabilir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <LucideIcons.Newspaper className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.author.firstName} {item.author.lastName} tarafından {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.viewCount} görüntülenme</p>
                  <Badge variant="outline">{item.category.name}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
