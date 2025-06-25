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
import { ClassifiedAdModal } from '@/components/ads/classified-ad-modal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { ClassifiedAdWithApprover } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function ClassifiedAds() {
  const [selectedAd, setSelectedAd] = useState<ClassifiedAdWithApprover | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    isPremium: 'all',
    search: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classifiedAds = [], isLoading } = useQuery<ClassifiedAdWithApprover[]>({
    queryKey: ['/api/classified-ads', filters.status, filters.category, filters.isPremium],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.isPremium && filters.isPremium !== 'all') params.append('isPremium', filters.isPremium);
      
      const response = await fetch(`/api/classified-ads?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Seri ilanlar yüklenemedi');
      return response.json();
    }
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/classified-ads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classified-ads'] });
      toast({
        title: 'Başarılı',
        description: 'Seri ilan silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Seri ilan silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const approveAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('POST', `/api/classified-ads/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classified-ads'] });
      toast({
        title: 'Başarılı',
        description: 'Seri ilan onaylandı',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Seri ilan onaylanırken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const rejectAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('POST', `/api/classified-ads/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classified-ads'] });
      toast({
        title: 'Başarılı',
        description: 'Seri ilan reddedildi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Seri ilan reddedilirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const handleEditAd = (ad: ClassifiedAdWithApprover) => {
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

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive',
      expired: 'secondary'
    } as const;

    const labels = {
      pending: 'Beklemede',
      approved: 'Onaylı',
      rejected: 'Reddedildi',
      expired: 'Süresi Doldu'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      vehicles: 'Araçlar',
      'real-estate': 'Emlak',
      electronics: 'Elektronik',
      'home-garden': 'Ev & Bahçe',
      jobs: 'İş İlanları',
      services: 'Hizmetler',
      fashion: 'Moda',
      sports: 'Spor'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatPrice = (price: string, currency: string) => {
    if (!price) return 'Belirtilmemiş';
    return `${parseFloat(price).toLocaleString('tr-TR')} ${currency}`;
  };

  const filteredAds = classifiedAds.filter(ad =>
    ad.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    ad.description.toLowerCase().includes(filters.search.toLowerCase()) ||
    ad.contactName.toLowerCase().includes(filters.search.toLowerCase())
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Seri İlan Yönetimi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Seri ilanları yönetin ve onaylayın</p>
        </div>
        <Button onClick={handleCreateAd} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Seri İlan</span>
          <span className="sm:hidden">İlan Ekle</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İlan</CardTitle>
            <LucideIcons.FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classifiedAds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
            <LucideIcons.Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classifiedAds.filter(ad => ad.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onaylı</CardTitle>
            <LucideIcons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classifiedAds.filter(ad => ad.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <LucideIcons.Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classifiedAds.filter(ad => ad.isPremium).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Seri İlanlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="İlan ara..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="max-w-sm"
            />
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="approved">Onaylı</SelectItem>
                <SelectItem value="rejected">Reddedildi</SelectItem>
                <SelectItem value="expired">Süresi Doldu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="vehicles">Araçlar</SelectItem>
                <SelectItem value="real-estate">Emlak</SelectItem>
                <SelectItem value="electronics">Elektronik</SelectItem>
                <SelectItem value="jobs">İş İlanları</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.isPremium} onValueChange={(value) => setFilters(prev => ({ ...prev, isPremium: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="true">Premium</SelectItem>
                <SelectItem value="false">Standart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İlan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <LucideIcons.FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      Henüz seri ilan bulunmuyor
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {ad.images && ad.images.length > 0 ? (
                          <img
                            src={ad.images[0]}
                            alt={ad.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <LucideIcons.Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{ad.title}</p>
                            {ad.isPremium && <Badge variant="default" className="text-xs">Premium</Badge>}
                            {ad.isUrgent && <Badge variant="destructive" className="text-xs">Acil</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {ad.description.substring(0, 50)}...
                          </p>
                          <div className="text-xs text-muted-foreground">
                            👁️ {ad.viewCount} görüntülenme
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryLabel(ad.category)}</Badge>
                      {ad.subcategory && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {ad.subcategory}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatPrice(ad.price || '', ad.currency)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{ad.location || 'Belirtilmemiş'}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ad.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{ad.contactName}</p>
                        {ad.contactPhone && (
                          <p className="text-muted-foreground">{ad.contactPhone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {ad.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => approveAdMutation.mutate(ad.id)}
                              disabled={approveAdMutation.isPending}
                              title="Onayla"
                            >
                              <LucideIcons.Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rejectAdMutation.mutate(ad.id)}
                              disabled={rejectAdMutation.isPending}
                              title="Reddet"
                            >
                              <LucideIcons.X className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAd(ad)}
                          title="Düzenle"
                        >
                          <LucideIcons.Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAdMutation.mutate(ad.id)}
                          disabled={deleteAdMutation.isPending}
                          title="Sil"
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

      <ClassifiedAdModal
        isOpen={isAdModalOpen}
        onClose={handleCloseModal}
        classifiedAd={selectedAd}
      />
    </div>
  );
}