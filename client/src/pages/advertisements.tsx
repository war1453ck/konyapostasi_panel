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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdvertisementModal } from '@/components/ads/advertisement-modal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { AdvertisementWithCreator } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function Advertisements() {
  const [selectedAd, setSelectedAd] = useState<AdvertisementWithCreator | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    isActive: '',
    position: '',
    search: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: advertisements = [], isLoading } = useQuery<AdvertisementWithCreator[]>({
    queryKey: ['/api/advertisements', filters.isActive, filters.position],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.isActive) params.append('isActive', filters.isActive);
      if (filters.position) params.append('position', filters.position);
      
      const response = await fetch(`/api/advertisements?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Reklamlar yüklenemedi');
      return response.json();
    }
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/advertisements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      toast({
        title: 'Başarılı',
        description: 'Reklam silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Reklam silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const handleEditAd = (ad: AdvertisementWithCreator) => {
    setSelectedAd(ad);
    setIsAdModalOpen(true);
  };

  const handleCreateAd = () => {
    setSelectedAd(null);
    setIsAdModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAd(null);
    setIsAdModalOpen(false);
  };

  const getPositionLabel = (position: string) => {
    const positions = {
      header: 'Header',
      sidebar: 'Sidebar',
      footer: 'Footer',
      content: 'İçerik Arası'
    };
    return positions[position as keyof typeof positions] || position;
  };

  const getSizeLabel = (size: string) => {
    const sizes = {
      banner: 'Banner (728x90)',
      rectangle: 'Rectangle (300x250)',
      square: 'Square (250x250)',
      skyscraper: 'Skyscraper (160x600)'
    };
    return sizes[size as keyof typeof sizes] || size;
  };

  const filteredAds = advertisements.filter(ad =>
    ad.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    ad.description?.toLowerCase().includes(filters.search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-foreground">Reklam Yönetimi</h1>
          <p className="text-muted-foreground">Reklamları yönetin ve performansları takip edin</p>
        </div>
        <Button onClick={handleCreateAd}>
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          Yeni Reklam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Reklam</CardTitle>
            <LucideIcons.BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertisements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Reklamlar</CardTitle>
            <LucideIcons.Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {advertisements.filter(ad => ad.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Tıklama</CardTitle>
            <LucideIcons.MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {advertisements.reduce((sum, ad) => sum + ad.clickCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <LucideIcons.TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {advertisements.reduce((sum, ad) => sum + ad.impressions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Reklamlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Reklam ara..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="max-w-sm"
            />
            <Select value={filters.isActive} onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Pasif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.position} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pozisyon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
                <SelectItem value="content">İçerik Arası</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reklam</TableHead>
                <TableHead>Pozisyon</TableHead>
                <TableHead>Boyut</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Performans</TableHead>
                <TableHead>Oluşturan</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      Henüz reklam bulunmuyor
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {ad.imageUrl ? (
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                            <LucideIcons.Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{ad.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {ad.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPositionLabel(ad.position)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getSizeLabel(ad.size)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                        {ad.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>👁️ {ad.impressions} görüntülenme</div>
                        <div>🖱️ {ad.clickCount} tıklama</div>
                        <div className="text-muted-foreground">
                          CTR: {ad.impressions > 0 ? ((ad.clickCount / ad.impressions) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{ad.creator.firstName} {ad.creator.lastName}</p>
                        <p className="text-muted-foreground">@{ad.creator.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAd(ad)}
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAdMutation.mutate(ad.id)}
                          disabled={deleteAdMutation.isPending}
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

      <AdvertisementModal
        isOpen={isAdModalOpen}
        onClose={handleCloseModal}
        advertisement={selectedAd}
      />
    </div>
  );
}