import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { YouTubeEmbed } from '@/components/youtube-embed';
import { isValidYouTubeUrl } from '@/lib/youtube';
import type { NewsWithDetails } from '@shared/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface NewsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsWithDetails | null;
}

export function NewsPreviewModal({ isOpen, onClose, news }: NewsPreviewModalProps) {
  if (!news) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Haber Önizleme</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{news.category?.name}</Badge>
              {news.city && <Badge variant="secondary">{news.city.name}</Badge>}
              {news.videoUrl && isValidYouTubeUrl(news.videoUrl) && (
                <Badge variant="default" className="bg-red-600">Video Haber</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold leading-tight">{news.title}</h1>
            
            {news.summary && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {news.summary}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {news.author?.firstName} {news.author?.lastName}
              </span>
              <span>•</span>
              <span>
                {format(new Date(news.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
              </span>
              {news.source && (
                <>
                  <span>•</span>
                  <span>{news.source}</span>
                </>
              )}
            </div>
          </div>

          {/* Video Content */}
          {news.videoUrl && isValidYouTubeUrl(news.videoUrl) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Video İçerik</h3>
              <YouTubeEmbed 
                url={news.videoUrl} 
                width={800} 
                height={450}
                className="mx-auto"
              />
            </div>
          )}

          {/* Featured Image */}
          {news.featuredImage && (
            <div className="space-y-4">
              <img
                src={news.featuredImage}
                alt={news.title}
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Haber İçeriği</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>

          {/* Editor Info */}
          {news.editor && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Editör: {news.editor.firstName} {news.editor.lastName}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}