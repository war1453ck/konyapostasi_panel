import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { ArticleWithDetails, Category } from '@shared/schema';
import * as LucideIcons from 'lucide-react';
import { ArticleModal } from '@/components/articles/article-modal';

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithDetails | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    categoryId: '',
    search: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: ['/api/articles', filters.status, filters.categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      
      const response = await fetch(`/api/articles?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Makaleler yüklenemedi');
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) throw new Error('Kategoriler yüklenemedi');
      return response.json();
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: 'Başarılı',
        description: 'Makale silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Makale silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const handleEditArticle = (article: ArticleWithDetails) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setIsArticleModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      review: 'outline',
      published: 'default',
      scheduled: 'destructive'
    } as const;

    const labels = {
      draft: 'Taslak',
      review: 'İnceleme',
      published: 'Yayında',
      scheduled: 'Planlandı'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
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

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    article.author.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
    article.author.lastName.toLowerCase().includes(filters.search.toLowerCase())
  );

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Makale Yönetimi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Yazarlar için makale sistemi</p>
        </div>
        <Button onClick={handleCreateArticle} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Makale</span>
          <span className="sm:hidden">Makale Ekle</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Input
              placeholder="Makale ara..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full sm:w-64 min-h-[44px]"
            />
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full sm:w-40 min-h-[44px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="review">İnceleme</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="scheduled">Planlandı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.categoryId} onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}>
              <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
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
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Makaleler ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="responsive-table">
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Görüntülenme</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      {filters.search || filters.status || filters.categoryId 
                        ? 'Arama kriterine uygun makale bulunamadı' 
                        : 'Henüz makale bulunmuyor'
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{article.title}</p>
                        {article.summary && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {article.summary}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {article.author.firstName} {article.author.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{article.author.username}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(article.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <LucideIcons.Eye className="w-4 h-4 mr-1" />
                        {article.viewCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(article.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArticleMutation.mutate(article.id)}
                          disabled={deleteArticleMutation.isPending}
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

      {/* Article Modal */}
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
      />
    </div>
  );
}