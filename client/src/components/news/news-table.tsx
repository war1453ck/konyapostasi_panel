import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { NEWS_STATUS_LABELS } from '@/lib/constants';
import { isValidYouTubeUrl } from '@/lib/youtube';
import type { NewsWithDetails } from '@shared/schema';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsTableProps {
  onEdit: (news: NewsWithDetails) => void;
  onPreview: (news: NewsWithDetails) => void;
}

export function NewsTable({ onEdit, onPreview }: NewsTableProps) {
  const [filters, setFilters] = useState({
    status: '',
    categoryId: '',
    search: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news = [], isLoading } = useQuery<NewsWithDetails[]>({
    queryKey: ['/api/news', filters.status, filters.categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      
      const response = await fetch(`/api/news?${params.toString()}`, {
        credentials: 'include'
      });
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

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Başarılı',
        description: 'Haber silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Haber silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      review: 'outline',
      published: 'default',
      scheduled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        <LucideIcons.Circle className={cn(
          "w-2 h-2 mr-1",
          status === 'published' && "fill-green-500 text-green-500",
          status === 'draft' && "fill-yellow-500 text-yellow-500",
          status === 'review' && "fill-blue-500 text-blue-500",
          status === 'scheduled' && "fill-purple-500 text-purple-500"
        )} />
        {NEWS_STATUS_LABELS[status as keyof typeof NEWS_STATUS_LABELS]}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = !filters.search || 
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.summary?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'all' || item.status === filters.status;
    const matchesCategory = !filters.categoryId || filters.categoryId === 'all' || item.categoryId?.toString() === filters.categoryId;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haber Listesi</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            placeholder="Haber ara..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="flex-1 min-h-[44px]"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full sm:w-32 min-h-[44px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="review">İncelemede</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="scheduled">Programlı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.categoryId} onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}>
              <SelectTrigger className="w-full sm:w-40 min-h-[44px]">
                <SelectValue placeholder="Kategori" />
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Görüntülenme</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      Henüz haber bulunmuyor
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {item.videoUrl && isValidYouTubeUrl(item.videoUrl) ? (
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <LucideIcons.Play className="w-4 h-4 text-red-600" />
                          </div>
                        ) : item.featuredImage ? (
                          <img
                            src={item.featuredImage}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-3">
                            <LucideIcons.Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {item.title || 'Başlıksız'}
                            {item.videoUrl && isValidYouTubeUrl(item.videoUrl) && (
                              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Video
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.summary?.substring(0, 50) || 'Özet yok'}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category?.name || 'Kategori Yok'}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.author?.firstName || 'Bilinmeyen'} {item.author?.lastName || 'Yazar'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <LucideIcons.Eye className="w-4 h-4 mr-1" />
                        {item.viewCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(item)}
                        >
                          <LucideIcons.Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNewsMutation.mutate(item.id)}
                          disabled={deleteNewsMutation.isPending}
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
          {filteredNews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <LucideIcons.FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Henüz haber bulunmuyor
              </div>
            </div>
          ) : (
            filteredNews.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start space-x-3">
                  {item.videoUrl && isValidYouTubeUrl(item.videoUrl) ? (
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Play className="w-6 h-6 text-red-600" />
                    </div>
                  ) : item.featuredImage ? (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm truncate pr-2">
                        {item.title || 'Başlıksız'}
                        {item.videoUrl && isValidYouTubeUrl(item.videoUrl) && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Video
                          </span>
                        )}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.summary || 'Özet yok'}
                    </p>
                    
                    <div className="flex flex-col space-y-2 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.category?.name || 'Kategori Yok'}
                        </Badge>
                        <span>
                          {item.author?.firstName || 'Bilinmeyen'} {item.author?.lastName || 'Yazar'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{formatDate(item.createdAt)}</span>
                        <div className="flex items-center">
                          <LucideIcons.Eye className="w-3 h-3 mr-1" />
                          {item.viewCount}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(item)}
                          className="h-8 w-8 p-0"
                        >
                          <LucideIcons.Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNewsMutation.mutate(item.id)}
                          disabled={deleteNewsMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <LucideIcons.Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}