import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Yedekleme ayarları için şema
const backupSettingsSchema = z.object({
  autoBackup: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

type BackupSettings = z.infer<typeof backupSettingsSchema>;

// Yedek dosyası tipi
interface BackupFile {
  filename: string;
  date: string;
  size: string;
  type: 'Otomatik' | 'Manuel';
}

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generalForm = useForm({
    defaultValues: {
      siteName: 'HaberPanel',
      siteDescription: 'Haber platformu yönetim paneli',
      siteUrl: 'https://haberpanel.com',
      adminEmail: 'admin@haberpanel.com',
      timezone: 'Europe/Istanbul',
      language: 'tr',
    },
  });

  const seoForm = useForm({
    defaultValues: {
      defaultMetaTitle: 'HaberPanel - Güncel Haberler',
      defaultMetaDescription: 'En güncel haberler ve analitik içerikler',
      keywords: 'haber, güncel, analiz, politika, ekonomi',
      googleAnalyticsId: '',
      googleSearchConsole: '',
      robotsTxt: 'User-agent: *\nDisallow: /admin/',
    },
  });

  const securityForm = useForm({
    defaultValues: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
    },
  });

  const notificationForm = useForm({
    defaultValues: {
      emailNotifications: true,
      newCommentNotification: true,
      newUserNotification: true,
      systemAlerts: true,
      weeklyReport: true,
    },
  });

  // Yedekleme ayarları için form
  const backupForm = useForm<BackupSettings>({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      autoBackup: true,
      frequency: 'daily',
    },
  });

  // Yedekleme ayarlarını al
  const { data: backupSettings } = useQuery({
    queryKey: ['/api/backup/settings'],
    onSuccess: (data) => {
      backupForm.reset(data);
    },
    onError: (error) => {
      toast({
        title: 'Hata',
        description: 'Yedekleme ayarları alınamadı',
        variant: 'destructive',
      });
    },
  });

  // Yedekleme listesini al
  const { data: backupList = [], refetch: refetchBackupList } = useQuery<BackupFile[]>({
    queryKey: ['/api/backup/list'],
    onError: (error) => {
      toast({
        title: 'Hata',
        description: 'Yedekleme listesi alınamadı',
        variant: 'destructive',
      });
    },
  });

  // Yedekleme ayarlarını güncelle
  const updateBackupSettingsMutation = useMutation({
    mutationFn: async (data: BackupSettings) => {
      return apiRequest('POST', '/api/backup/settings', data);
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Yedekleme ayarları güncellendi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Yedekleme ayarları güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  // Manuel yedekleme oluştur
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/backup/create');
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Yedekleme başarıyla oluşturuldu',
      });
      refetchBackupList();
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Yedekleme oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  // Yedekleme geri yükle
  const restoreBackupMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return fetch('/api/backup/restore', {
        method: 'POST',
        body: formData,
      }).then(res => {
        if (!res.ok) throw new Error('Yedekleme geri yüklenirken bir hata oluştu');
        return res.json();
      });
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Yedekleme başarıyla geri yüklendi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Yedekleme geri yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  // Yedekleme dosyasını sil
  const deleteBackupMutation = useMutation({
    mutationFn: async (filename: string) => {
      return apiRequest('DELETE', `/api/backup/${filename}`);
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Yedekleme dosyası silindi',
      });
      refetchBackupList();
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Yedekleme dosyası silinirken bir hata oluştu',
        variant: 'destructive',
      });
    },
  });

  const onGeneralSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Başarılı',
        description: 'Genel ayarlar güncellendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ayarlar güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSeoSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Başarılı',
        description: 'SEO ayarları güncellendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'SEO ayarları güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Başarılı',
        description: 'Güvenlik ayarları güncellendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Güvenlik ayarları güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Başarılı',
        description: 'Bildirim ayarları güncellendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Bildirim ayarları güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onBackupSettingsSubmit = (data: BackupSettings) => {
    updateBackupSettingsMutation.mutate(data);
  };

  const handleCreateBackup = () => {
    createBackupMutation.mutate();
  };

  const handleRestoreBackup = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('backupFile', file);
    
    restoreBackupMutation.mutate(formData);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadBackup = (filename: string) => {
    window.open(`/api/backup/download/${filename}`, '_blank');
  };

  const handleDeleteBackup = (filename: string) => {
    if (window.confirm('Bu yedekleme dosyasını silmek istediğinizden emin misiniz?')) {
      deleteBackupMutation.mutate(filename);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Ayarlar</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Platform ayarlarını yönetin</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="general" className="text-xs sm:text-sm">Genel</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">SEO</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Güvenlik</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Bildirimler</TabsTrigger>
          <TabsTrigger value="backup" className="text-xs sm:text-sm">Yedekleme</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Adı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="siteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Açıklaması</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yönetici E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saat Dilimi</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Europe/Istanbul">Türkiye (UTC+3)</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="Europe/London">Londra (UTC+0)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan Dil</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full md:w-48">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tr">Türkçe</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...seoForm}>
                <form onSubmit={seoForm.handleSubmit(onSeoSubmit)} className="space-y-6">
                  <FormField
                    control={seoForm.control}
                    name="defaultMetaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan Meta Başlık</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={seoForm.control}
                    name="defaultMetaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan Meta Açıklama</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={seoForm.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan Anahtar Kelimeler</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="kelime1, kelime2, kelime3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={seoForm.control}
                      name="googleAnalyticsId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="GA-XXXXXXXXX-X" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={seoForm.control}
                      name="googleSearchConsole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Search Console</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doğrulama kodu" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={seoForm.control}
                    name="robotsTxt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Robots.txt İçeriği</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="requireEmailVerification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">E-posta Doğrulama</FormLabel>
                            <FormDescription>
                              Yeni kullanıcıların e-posta adreslerini doğrulamasını zorunlu kıl
                            </FormDescription>
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
                      control={securityForm.control}
                      name="enableTwoFactor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">İki Faktörlü Kimlik Doğrulama</FormLabel>
                            <FormDescription>
                              Yönetici hesapları için 2FA zorunlu kıl
                            </FormDescription>
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
                      control={securityForm.control}
                      name="requireStrongPassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Güçlü Şifre Zorunluluğu</FormLabel>
                            <FormDescription>
                              Şifrelerde büyük harf, küçük harf, sayı ve özel karakter zorunlu kıl
                            </FormDescription>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maksimum Giriş Denemesi</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Oturum Zaman Aşımı (dakika)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Şifre Uzunluğu</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">E-posta Bildirimleri</FormLabel>
                            <FormDescription>
                              Genel e-posta bildirimlerini etkinleştir
                            </FormDescription>
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
                      control={notificationForm.control}
                      name="newCommentNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Yeni Yorum Bildirimleri</FormLabel>
                            <FormDescription>
                              Yeni yorumlar için bildirim al
                            </FormDescription>
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
                      control={notificationForm.control}
                      name="newUserNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Yeni Kullanıcı Bildirimleri</FormLabel>
                            <FormDescription>
                              Yeni kullanıcı kayıtları için bildirim al
                            </FormDescription>
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
                      control={notificationForm.control}
                      name="systemAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Sistem Uyarıları</FormLabel>
                            <FormDescription>
                              Kritik sistem olayları için bildirim al
                            </FormDescription>
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
                      control={notificationForm.control}
                      name="weeklyReport"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Haftalık Raporlar</FormLabel>
                            <FormDescription>
                              Haftalık performans raporları al
                            </FormDescription>
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

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Yedekleme Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Otomatik Yedekleme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...backupForm}>
                      <form onSubmit={backupForm.handleSubmit(onBackupSettingsSubmit)} className="space-y-4">
                        <FormField
                          control={backupForm.control}
                          name="autoBackup"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Otomatik yedekleme</FormLabel>
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
                          control={backupForm.control}
                          name="frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Yedekleme Sıklığı</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!backupForm.watch('autoBackup')}
                              >
                                <FormControl>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Günlük</SelectItem>
                                  <SelectItem value="weekly">Haftalık</SelectItem>
                                  <SelectItem value="monthly">Aylık</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updateBackupSettingsMutation.isPending}
                        >
                          {updateBackupSettingsMutation.isPending ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manuel Yedekleme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sistem verilerinizin manuel yedeğini oluşturun
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleCreateBackup}
                      disabled={createBackupMutation.isPending}
                    >
                      <LucideIcons.Download className="w-4 h-4 mr-2" />
                      {createBackupMutation.isPending ? 'Yedek Oluşturuluyor...' : 'Yedek Oluştur'}
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleRestoreBackup}
                      disabled={restoreBackupMutation.isPending}
                    >
                      <LucideIcons.Upload className="w-4 h-4 mr-2" />
                      {restoreBackupMutation.isPending ? 'Yedek Geri Yükleniyor...' : 'Yedek Geri Yükle'}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".sql"
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yedek Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {backupList.length > 0 ? (
                      backupList.map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{formatDate(backup.date)}</p>
                            <p className="text-xs text-muted-foreground">{backup.type} - {backup.size}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadBackup(backup.filename)}
                              title="İndir"
                            >
                              <LucideIcons.Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteBackup(backup.filename)}
                              title="Sil"
                            >
                              <LucideIcons.Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <LucideIcons.Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Henüz yedekleme yapılmamış</p>
                        <p className="text-sm mt-1">İlk yedeğinizi oluşturmak için "Yedek Oluştur" düğmesine tıklayın</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
