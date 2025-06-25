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
import { COMMENT_STATUS_LABELS } from '@/lib/constants';
import type { CommentWithNews } from '@shared/schema';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Comments() {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentWithNews[]>({
    queryKey: ['/api/comments', filters.status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      
      const response = await fetch(`/api/comments?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Yorumlar yüklenemedi');
      return response.json();
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PUT', `/api/comments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: 'Başarılı',
        description: 'Yorum durumu güncellendi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Yorum güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: 'Başarılı',
        description: 'Yorum silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Yorum silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        <LucideIcons.Circle className={cn(
          "w-2 h-2 mr-1",
          status === 'approved' && "text-green-500",
          status === 'pending' && "text-yellow-500",
          status === 'rejected' && "text-red-500"
        )} />
        {COMMENT_STATUS_LABELS[status as keyof typeof COMMENT_STATUS_LABELS]}
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

  const filteredComments = comments.filter(comment =>
    comment.authorName.toLowerCase().includes(filters.search.toLowerCase()) ||
    comment.content.toLowerCase().includes(filters.search.toLowerCase()) ||
    comment.news.title.toLowerCase().includes(filters.search.toLowerCase())
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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yorum Moderasyonu</h1>
          <p className="text-muted-foreground">Kullanıcı yorumlarını yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Yorum ara..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-64"
          />
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="approved">Onaylandı</SelectItem>
              <SelectItem value="rejected">Reddedildi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <LucideIcons.Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Beklemede</p>
                <p className="text-2xl font-bold">
                  {comments.filter(c => c.status === 'pending').length}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Onaylandı</p>
                <p className="text-2xl font-bold">
                  {comments.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <LucideIcons.XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Reddedildi</p>
                <p className="text-2xl font-bold">
                  {comments.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yorumlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="responsive-table">
            <TableHeader>
              <TableRow>
                <TableHead>Yazar</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Haber</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      {filters.search || filters.status 
                        ? 'Arama kriterine uygun yorum bulunamadı' 
                        : 'Henüz yorum bulunmuyor'
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comment.authorName}</p>
                        <p className="text-sm text-muted-foreground">{comment.authorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate" title={comment.content}>
                        {comment.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{comment.news.title}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(comment.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(comment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {comment.status !== 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCommentMutation.mutate({ id: comment.id, status: 'approved' })}
                            disabled={updateCommentMutation.isPending}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <LucideIcons.Check className="w-4 h-4" />
                          </Button>
                        )}
                        {comment.status !== 'rejected' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCommentMutation.mutate({ id: comment.id, status: 'rejected' })}
                            disabled={updateCommentMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <LucideIcons.X className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          disabled={deleteCommentMutation.isPending}
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
    </div>
  );
}
