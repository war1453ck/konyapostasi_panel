import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertClassifiedAdSchema } from '@shared/schema';
import type { ClassifiedAdWithApprover } from '@shared/schema';
import { z } from 'zod';
import * as LucideIcons from 'lucide-react';

const classifiedAdFormSchema = insertClassifiedAdSchema.extend({
  expiresAt: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type ClassifiedAdFormData = z.infer<typeof classifiedAdFormSchema>;

interface ClassifiedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  classifiedAd?: ClassifiedAdWithApprover | null;
}

const CATEGORIES = [
  { value: 'vehicles', label: 'Araçlar', subcategories: ['cars', 'motorcycles', 'trucks', 'boats'] },
  { value: 'real-estate', label: 'Emlak', subcategories: ['sale', 'rent', 'land', 'commercial'] },
  { value: 'electronics', label: 'Elektronik', subcategories: ['phones', 'computers', 'tv-audio', 'gaming'] },
  { value: 'home-garden', label: 'Ev & Bahçe', subcategories: ['furniture', 'appliances', 'decoration', 'garden'] },
  { value: 'jobs', label: 'İş İlanları', subcategories: ['full-time', 'part-time', 'freelance', 'internship'] },
  { value: 'services', label: 'Hizmetler', subcategories: ['education', 'health', 'beauty', 'repair'] },
  { value: 'fashion', label: 'Moda', subcategories: ['clothing', 'shoes', 'accessories', 'bags'] },
  { value: 'sports', label: 'Spor', subcategories: ['fitness', 'outdoor', 'team-sports', 'water-sports'] },
];

const CURRENCIES = [
  { value: 'TRY', label: 'TL' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

export function ClassifiedAdModal({ isOpen, onClose, classifiedAd }: ClassifiedAdModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const form = useForm<ClassifiedAdFormData>({
    resolver: zodResolver(classifiedAdFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'vehicles',
      subcategory: 'cars',
      price: '',
      currency: 'TRY',
      location: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      status: 'pending',
      isPremium: false,
      isUrgent: false,
    },
  });

  const selectedCategory = form.watch('category');
  const currentCategory = CATEGORIES.find(cat => cat.value === selectedCategory);

  const createMutation = useMutation({
    mutationFn: async (data: ClassifiedAdFormData) => {
      const payload = {
        ...data,
        images: imageUrls,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };
      return apiRequest('POST', '/api/classified-ads', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classified-ads'] });
      toast({
        title: 'Başarılı',
        description: 'Seri ilan oluşturuldu',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Seri ilan oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ClassifiedAdFormData) => {
      const payload = {
        ...data,
        images: imageUrls,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };
      return apiRequest('PATCH', `/api/classified-ads/${classifiedAd!.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classified-ads'] });
      toast({
        title: 'Başarılı',
        description: 'Seri ilan güncellendi',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Hata',
        description: 'Seri ilan güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  useEffect(() => {
    if (classifiedAd) {
      form.reset({
        title: classifiedAd.title,
        description: classifiedAd.description,
        category: classifiedAd.category,
        subcategory: classifiedAd.subcategory || 'cars',
        price: classifiedAd.price || '',
        currency: classifiedAd.currency,
        location: classifiedAd.location || '',
        contactName: classifiedAd.contactName,
        contactPhone: classifiedAd.contactPhone || '',
        contactEmail: classifiedAd.contactEmail || '',
        status: classifiedAd.status,
        isPremium: classifiedAd.isPremium,
        isUrgent: classifiedAd.isUrgent,
        expiresAt: classifiedAd.expiresAt ? new Date(classifiedAd.expiresAt).toISOString().slice(0, 16) : '',
      });
      setImageUrls(classifiedAd.images || []);
    } else {
      form.reset({
        title: '',
        description: '',
        category: 'vehicles',
        subcategory: 'cars',
        price: '',
        currency: 'TRY',
        location: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        status: 'pending',
        isPremium: false,
        isUrgent: false,
        expiresAt: '',
      });
      setImageUrls([]);
    }
  }, [classifiedAd, form]);

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ClassifiedAdFormData) => {
    if (classifiedAd) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {classifiedAd ? 'Seri İlanı Düzenle' : 'Yeni Seri İlan Oluştur'}
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
                    <FormLabel>İlan Başlığı</FormLabel>
                    <FormControl>
                      <Input placeholder="İlan başlığını girin..." {...field} />
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
                        placeholder="İlan detaylarını yazın..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Kategori</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Alt kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentCategory?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        )) || (
                          <SelectItem value="default">Varsayılan</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Para Birimi</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
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
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Konum</FormLabel>
                    <FormControl>
                      <Input placeholder="İl, İlçe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İletişim Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+90 555 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="ornek@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Son Geçerlilik Tarihi</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Durum</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="isPremium"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">Premium</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isUrgent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">Acil</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Image Management */}
            <div className="space-y-4">
              <FormLabel>Görseller</FormLabel>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Görsel URL'si girin..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" onClick={addImageUrl}>
                  <LucideIcons.Plus className="w-4 h-4" />
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Görsel ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImageUrl(index)}
                      >
                        <LucideIcons.X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {classifiedAd ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}