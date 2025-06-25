import { useState } from 'react';
import { NewsTable } from '@/components/news/news-table';
import { NewsModal } from '@/components/news/news-modal';
import { NewsPreviewModal } from '@/components/news/news-preview-modal';
import { Button } from '@/components/ui/button';
import type { NewsWithDetails } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function NewsList() {
  const [selectedNews, setSelectedNews] = useState<NewsWithDetails | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Haber Yönetimi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Tüm haberleri buradan yönetebilirsiniz</p>
        </div>
        <Button onClick={handleCreateNews} className="w-full sm:w-auto min-h-[44px]">
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Yeni Haber</span>
          <span className="sm:hidden">Haber Ekle</span>
        </Button>
      </div>

      {/* News Table */}
      <NewsTable 
        onEdit={handleEditNews}
        onPreview={handlePreviewNews}
      />

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
