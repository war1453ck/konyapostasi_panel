import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/youtube';

interface YouTubeEmbedProps {
  url: string;
  width?: number;
  height?: number;
  className?: string;
}

export function YouTubeEmbed({ url, width = 560, height = 315, className = '' }: YouTubeEmbedProps) {
  if (!isValidYouTubeUrl(url)) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-muted-foreground">Geçersiz YouTube URL'si</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-muted-foreground">Video yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg"
      />
    </div>
  );
}