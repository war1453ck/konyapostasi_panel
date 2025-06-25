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
          status === 'published' && "text-green-500",
          status === 'review' && "text-yellow-500",
          status === 'draft' && "text-gray-500",
          status === 'scheduled' && "text-blue-500"
        )} />
        {NEWS_STATUS_LABELS[status as keyof typeof NEWS_STATUS_LABELS]}
      </Badge>
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.author.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.author.lastName.toLowerCase().includes(filters.search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="loading-spinner w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Haberler</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ara..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-32">
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
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
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
        <Table className="responsive-table">
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
                      {item.featuredImage ? (
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
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.summary?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.author.firstName} {item.author.lastName}
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
      </CardContent>
    </Card>
  );
}
