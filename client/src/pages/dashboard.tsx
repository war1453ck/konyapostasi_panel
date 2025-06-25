import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/stats-card';
import { NewsTable } from '@/components/news/news-table';
import { NewsModal } from '@/components/news/news-modal';
import { NewsPreviewModal } from '@/components/news/news-preview-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { NewsWithDetails } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function Dashboard() {
  const [selectedNews, setSelectedNews] = useState<NewsWithDetails | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats', { credentials: 'include' });
      if (!response.ok) throw new Error('İstatistikler yüklenemedi');
      return response.json();
    }
  });

  const { data: recentComments = [] } = useQuery({
    queryKey: ['/api/comments', 'pending'],
    queryFn: async () => {
      const response = await fetch('/api/comments?status=pending', { credentials: 'include' });
      if (!response.ok) throw new Error('Yorumlar yüklenemedi');
      return response.json();
    }
  });

  const handleEditNews = (news: NewsWithDetails) => {
    setSelectedNews(news);
    setIsNewsModalOpen(true);
  };

  const handlePreviewNews = (news: NewsWithDetails) => {
    setSelectedNews(news);
    setIsPreviewModalOpen(true);
  };

  const handleCreateNews = () => {
    setSelectedNews(null);
    setIsNewsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
    setIsNewsModalOpen(false);
  };

  const handleClosePreviewModal = () => {
    setSelectedNews(null);
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Haber platformu yönetim paneline hoş geldiniz</p>
        </div>
        <Button onClick={handleCreateNews} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Haber</span>
          <span className="sm:hidden">Haber Ekle</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Toplam Haber"
          value={stats?.totalNews || 0}
          change="%12 artış"
          changeType="increase"
          icon={<LucideIcons.Newspaper className="w-6 h-6 text-primary" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatsCard
          title="Aktif Yazarlar"
          value={stats?.activeWriters || 0}
          change="%8 artış"
          changeType="increase"
          icon={<LucideIcons.Users className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900"
        />
        <StatsCard
          title="Bekleyen Yorumlar"
          value={stats?.pendingComments || 0}
          change="%3 azalış"
          changeType="decrease"
          icon={<LucideIcons.MessageSquare className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900"
        />
        <StatsCard
          title="Bugünkü Görüntülenme"
          value={stats?.todayViews || 0}
          change="%15 artış"
          changeType="increase"
          icon={<LucideIcons.Eye className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Table */}
        <div className="lg:col-span-2">
          <NewsTable 
            onEdit={handleEditNews}
            onPreview={handlePreviewNews}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleCreateNews}>
                <LucideIcons.Plus className="w-4 h-4 mr-2" />
                Yeni Haber Oluştur
              </Button>
              <Button variant="outline" className="w-full">
                <LucideIcons.Upload className="w-4 h-4 mr-2" />
                Medya Yükle
              </Button>
              <Button variant="outline" className="w-full">
                <LucideIcons.Tags className="w-4 h-4 mr-2" />
                Kategori Yönet
              </Button>
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Son Yorumlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Bekleyen yorum yok</p>
                ) : (
                  recentComments.slice(0, 5).map((comment: any) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <LucideIcons.MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{comment.authorName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {comment.content.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sunucu Durumu</span>
                  <span className="flex items-center text-sm text-green-600">
                    <LucideIcons.Circle className="w-2 h-2 mr-1 fill-current" />
                    Çevrimiçi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Veritabanı</span>
                  <span className="flex items-center text-sm text-green-600">
                    <LucideIcons.Circle className="w-2 h-2 mr-1 fill-current" />
                    Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Son Yedekleme</span>
                  <span className="text-sm text-muted-foreground">2 saat önce</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News Modal */}
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={handleCloseModal}
        news={selectedNews}
      />

      {/* News Preview Modal */}
      <NewsPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        news={selectedNews}
      />
    </div>
  );
}
