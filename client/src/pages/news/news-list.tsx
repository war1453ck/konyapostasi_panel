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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Haber Yönetimi</h1>
          <p className="text-muted-foreground">Tüm haberleri buradan yönetebilirsiniz</p>
        </div>
        <Button onClick={handleCreateNews}>
          <LucideIcons.Plus className="w-4 h-4 mr-2" />
          Yeni Haber
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
