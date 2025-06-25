import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertAdvertisementSchema } from '@shared/schema';
import type { AdvertisementWithCreator } from '@shared/schema';
import { z } from 'zod';

const adFormSchema = insertAdvertisementSchema.extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type AdFormData = z.infer<typeof adFormSchema>;

interface AdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  advertisement?: AdvertisementWithCreator | null;
}

const AD_POSITIONS = [
  { value: 'header', label: 'Header (Üst Banner)' },
  { value: 'sidebar', label: 'Sidebar (Yan Panel)' },
  { value: 'footer', label: 'Footer (Alt Banner)' },
  { value: 'content', label: 'Content (İçerik Arası)' },
];

const AD_SIZES = [
  { value: 'banner', label: 'Banner (728x90)' },
  { value: 'rectangle', label: 'Rectangle (300x250)' },
  { value: 'square', label: 'Square (250x250)' },
  { value: 'skyscraper', label: 'Skyscraper (160x600)' },
];

export function AdvertisementModal({ isOpen, onClose, advertisement }: AdvertisementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'header',
      size: 'banner',
      isActive: true,
      priority: 0,
      createdBy: 1, // Current user ID
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AdFormData) => {
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      };
      return apiRequest('POST', '/api/advertisements', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      toast({
        title: 'Başarılı',
        description: 'Reklam oluşturuldu',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Reklam oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AdFormData) => {
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      };
      return apiRequest('PATCH', `/api/advertisements/${advertisement!.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      toast({
        title: 'Başarılı',
        description: 'Reklam güncellendi',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Reklam güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  useEffect(() => {
    if (advertisement) {
      form.reset({
        title: advertisement.title,
        description: advertisement.description || '',
        imageUrl: advertisement.imageUrl || '',
        linkUrl: advertisement.linkUrl || '',
        position: advertisement.position,
        size: advertisement.size,
        isActive: advertisement.isActive,
        priority: advertisement.priority,
        createdBy: advertisement.createdBy,
        startDate: advertisement.startDate ? new Date(advertisement.startDate).toISOString().slice(0, 16) : '',
        endDate: advertisement.endDate ? new Date(advertisement.endDate).toISOString().slice(0, 16) : '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        position: 'header',
        size: 'banner',
        isActive: true,
        priority: 0,
        createdBy: 1,
        startDate: '',
        endDate: '',
      });
    }
  }, [advertisement, form]);

  const onSubmit = (data: AdFormData) => {
    if (advertisement) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {advertisement ? 'Reklamı Düzenle' : 'Yeni Reklam Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Reklam Başlığı</FormLabel>
                    <FormControl>
                      <Input placeholder="Reklam başlığını girin..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Reklam açıklaması..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Görsel URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Hedef URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pozisyon</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AD_POSITIONS.map((position) => (
                          <SelectItem key={position.value} value={position.value}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boyut</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AD_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Öncelik</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktif</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Reklamın gösterilip gösterilmeyeceği
                      </div>
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

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlangıç Tarihi</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bitiş Tarihi</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {advertisement ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}