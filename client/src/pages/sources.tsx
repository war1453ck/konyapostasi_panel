import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Globe, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertSourceSchema, type InsertSource, type Source } from '@shared/schema';

export default function Sources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertSource>({
    resolver: zodResolver(insertSourceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      website: '',
      contactEmail: '',
      type: 'online',
      isActive: true,
    },
  });

  const { data: sources, isLoading } = useQuery({
    queryKey: ['/api/sources'],
  });

  const createSourceMutation = useMutation({
    mutationFn: (data: InsertSource) =>
      fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: 'Başarılı',
        description: 'Kaynak başarıyla oluşturuldu',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kaynak oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const updateSourceMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<InsertSource> & { id: number }) =>
      fetch(`/api/sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      setIsModalOpen(false);
      form.reset();
      setSelectedSource(null);
      toast({
        title: 'Başarılı',
        description: 'Kaynak başarıyla güncellendi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kaynak güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/sources/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Silme işlemi başarısız' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      toast({
        title: 'Başarılı',
        description: 'Kaynak başarıyla silindi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kaynak silinirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleCreateSource = () => {
    setSelectedSource(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      website: '',
      contactEmail: '',
      type: 'online',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditSource = (source: Source) => {
    setSelectedSource(source);
    form.reset({
      name: source.name,
      slug: source.slug,
      description: source.description || '',
      website: source.website || '',
      contactEmail: source.contactEmail || '',
      type: source.type,
      isActive: source.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeleteSource = (id: number) => {
    if (confirm('Bu kaynağı silmek istediğinizden emin misiniz? Bu kaynağı kullanan haberler varsa önce onları başka kaynaklara taşımanız gerekebilir.')) {
      deleteSourceMutation.mutate(id);
    }
  };

  const onSubmit = (data: InsertSource) => {
    if (selectedSource) {
      updateSourceMutation.mutate({ ...data, id: selectedSource.id });
    } else {
      createSourceMutation.mutate(data);
    }
  };

  const getSourceTypeLabel = (type: string) => {
    const types = {
      newspaper: 'Gazete',
      magazine: 'Dergi',
      online: 'Online',
      tv: 'Televizyon',
      radio: 'Radyo',
      agency: 'Ajans',
      social: 'Sosyal Medya'
    };
    return types[type as keyof typeof types] || type;
  };

  const getSourceTypeColor = (type: string) => {
    const colors = {
      newspaper: 'bg-blue-100 text-blue-800',
      magazine: 'bg-purple-100 text-purple-800',
      online: 'bg-green-100 text-green-800',
      tv: 'bg-red-100 text-red-800',
      radio: 'bg-orange-100 text-orange-800',
      agency: 'bg-yellow-100 text-yellow-800',
      social: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Haber Kaynakları</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Haber kaynaklarınızı yönetin</p>
        </div>
        <Button onClick={handleCreateSource} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kaynak
        </Button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sources?.map((source: Source) => (
          <Card key={source.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg truncate">{source.name}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">/{source.slug}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {source.isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getSourceTypeColor(source.type)}`}>
                  {getSourceTypeLabel(source.type)}
                </Badge>
                <Badge variant={source.isActive ? 'default' : 'secondary'} className="text-xs">
                  {source.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              
              {source.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {source.description}
                </p>
              )}
              
              <div className="space-y-2">
                {source.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={source.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate"
                    >
                      {source.website}
                    </a>
                  </div>
                )}
                {source.contactEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{source.contactEmail}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-1 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSource(source)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSource(source.id)}
                  disabled={deleteSourceMutation.isPending}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {selectedSource ? 'Kaynak Düzenle' : 'Yeni Kaynak'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Kaynak Adı</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="h-9 sm:h-10"
                        onChange={(e) => {
                          field.onChange(e);
                          if (!selectedSource) {
                            form.setValue('slug', generateSlug(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9 sm:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Açıklama</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Kaynak Türü</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9 sm:h-10">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="newspaper">Gazete</SelectItem>
                          <SelectItem value="magazine">Dergi</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="tv">Televizyon</SelectItem>
                          <SelectItem value="radio">Radyo</SelectItem>
                          <SelectItem value="agency">Ajans</SelectItem>
                          <SelectItem value="social">Sosyal Medya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 sm:p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Aktif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" className="h-9 sm:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">İletişim E-posta</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="iletisim@kaynak.com" className="h-9 sm:h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 pt-3 sm:pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 sm:h-10 order-2 sm:order-1"
                >
                  İptal
                </Button>
                <Button 
                  type="submit"
                  disabled={createSourceMutation.isPending || updateSourceMutation.isPending}
                  className="h-9 sm:h-10 order-1 sm:order-2"
                >
                  {createSourceMutation.isPending || updateSourceMutation.isPending ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  ) : null}
                  {selectedSource ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}