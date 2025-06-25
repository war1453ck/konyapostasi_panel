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
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { NewsWithDetails } from '@shared/schema';

export default function Newspaper() {
  const [filters, setFilters] = useState({
    search: '',
    city: 'all',
    category: 'all',
    date: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news = [], isLoading } = useQuery<NewsWithDetails[]>({
    queryKey: ['/api/news'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['/api/cities'],
  });

  // Filter published news only for newspaper view
  const publishedNews = news.filter(item => item.status === 'published');

  const filteredNews = publishedNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.summary?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCity = filters.city === 'all' || item.cityId?.toString() === filters.city;
    const matchesCategory = filters.category === 'all' || item.categoryId?.toString() === filters.category;
    const matchesDate = !filters.date || new Date(item.createdAt).toDateString() === new Date(filters.date).toDateString();
    
    return matchesSearch && matchesCity && matchesCategory && matchesDate;
  });

  // Group news by category for newspaper layout
  const newsByCategory = categories.reduce((acc: any, category: any) => {
    acc[category.name] = filteredNews.filter(item => item.categoryId === category.id);
    return acc;
  }, {});

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <p className="text-muted-foreground">Yayınlanan haberlerin gazete görünümü</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <LucideIcons.Download className="w-4 h-4 mr-2" />
            PDF İndir
          </Button>
          <Button variant="outline">
            <LucideIcons.Share className="w-4 h-4 mr-2" />
            Paylaş
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Haber</CardTitle>
            <LucideIcons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedNews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Haberler</CardTitle>
            <LucideIcons.Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedNews.filter(item => 
                new Date(item.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <LucideIcons.Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Şehirler</CardTitle>
            <LucideIcons.MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cities.length}</div>
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
              placeholder="Haber ara..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-64"
            />
            <select 
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tüm Şehirler</option>
              {cities.map((city: any) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="layout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="layout">Gazete Düzeni</TabsTrigger>
          <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-6">
          {/* Newspaper Layout */}
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            {/* Newspaper Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-4xl font-bold mb-2">DİJİTAL GAZETE</h1>
              <p className="text-lg">{formatDate(new Date())}</p>
            </div>

            {/* Featured News */}
            {filteredNews.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h2 className="text-2xl font-bold mb-2">{filteredNews[0].title}</h2>
                      <p className="text-muted-foreground mb-2">{filteredNews[0].summary}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{filteredNews[0].category?.name}</Badge>
                        {filteredNews[0].city && <Badge variant="secondary">{filteredNews[0].city.name}</Badge>}
                        <span>•</span>
                        <span>{formatTime(filteredNews[0].createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(newsByCategory).map(([categoryName, categoryNews]: [string, any]) => {
                if (categoryNews.length === 0) return null;
                
                return (
                  <div key={categoryName} className="space-y-4">
                    <h3 className="text-xl font-bold border-b border-gray-300 pb-2">
                      {categoryName}
                    </h3>
                    {categoryNews.slice(0, 5).map((item: NewsWithDetails) => (
                      <div key={item.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                        <h4 className="font-semibold text-sm mb-1 leading-tight">
                          {item.title}
                        </h4>
                        {item.summary && (
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                            {item.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {item.city && <span>{item.city.name}</span>}
                          <span>•</span>
                          <span>{formatTime(item.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table">
          {/* Table View */}
          <Card>
            <CardHeader>
              <CardTitle>Haber Listesi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Şehir</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category?.name}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.city ? (
                          <Badge variant="secondary">{item.city.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'published' ? 'Yayında' : 
                           item.status === 'draft' ? 'Taslak' :
                           item.status === 'review' ? 'İncelemede' : 'Programlı'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <LucideIcons.MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <LucideIcons.Eye className="w-4 h-4 mr-2" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <LucideIcons.Share className="w-4 h-4 mr-2" />
                              Paylaş
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}