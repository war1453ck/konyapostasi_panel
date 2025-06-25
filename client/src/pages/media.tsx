import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileUpload } from '@/components/file-upload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Media } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export default function MediaLibrary() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles = [], isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    queryFn: async () => {
      const response = await fetch('/api/media', { credentials: 'include' });
      if (!response.ok) throw new Error('Medya dosyaları yüklenemedi');
      return response.json();
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // In a real implementation, you would upload files to a server or cloud storage
      // For now, we'll simulate the upload process
      const uploadPromises = files.map(async (file) => {
        const mediaData = {
          filename: `${Date.now()}-${file.name}`,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: `/uploads/${Date.now()}-${file.name}`,
          uploadedBy: 1, // Current user ID
        };
        
        return await apiRequest('POST', '/api/media', mediaData);
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Başarılı',
        description: `${selectedFiles.length} dosya yüklendi`,
      });
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Dosyalar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Başarılı',
        description: 'Dosya silindi',
      });
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Dosya silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const handleFileUpload = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      uploadMediaMutation.mutate(selectedFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <LucideIcons.Image className="w-6 h-6" />;
    } else if (mimeType.startsWith('video/')) {
      return <LucideIcons.Video className="w-6 h-6" />;
    } else if (mimeType.includes('pdf')) {
      return <LucideIcons.FileText className="w-6 h-6" />;
    } else {
      return <LucideIcons.File className="w-6 h-6" />;
    }
  };

  const filteredMedia = mediaFiles.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-foreground">Medya Kütüphanesi</h1>
          <p className="text-muted-foreground">Dosyalarınızı yönetin</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <LucideIcons.Upload className="w-4 h-4 mr-2" />
          Dosya Yükle
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Dosya ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <div className="text-sm text-muted-foreground">
          Toplam {filteredMedia.length} dosya
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LucideIcons.Images className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'Dosya bulunamadı' : 'Henüz dosya yüklenmemiş'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Arama kriterinize uygun dosya bulunamadı' : 'İlk dosyanızı yükleyerek başlayın'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <LucideIcons.Upload className="w-4 h-4 mr-2" />
                İlk Dosyayı Yükle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((file) => (
            <Card key={file.id} className="group relative">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                  {file.mimeType.startsWith('image/') ? (
                    <img
                      src={file.path}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {getFileIcon(file.mimeType)}
                    </div>
                  )}
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button size="sm" variant="secondary">
                      <LucideIcons.Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <LucideIcons.Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteMediaMutation.mutate(file.id)}
                      disabled={deleteMediaMutation.isPending}
                    >
                      <LucideIcons.Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-sm truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dosya Yükle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
                'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
                'application/pdf': ['.pdf'],
                'text/*': ['.txt', '.doc', '.docx']
              }}
              maxFiles={10}
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Seçilen Dosyalar ({selectedFiles.length}):</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFiles([]);
                }}
              >
                İptal
              </Button>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploadMediaMutation.isPending}
              >
                {uploadMediaMutation.isPending ? 'Yükleniyor...' : 'Yükle'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
