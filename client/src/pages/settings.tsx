import { useState } from 'react';
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

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
                    <div className="flex items-center justify-between">
                      <span>Otomatik yedekleme</span>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Yedekleme Sıklığı</label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Günlük</SelectItem>
                          <SelectItem value="weekly">Haftalık</SelectItem>
                          <SelectItem value="monthly">Aylık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Ayarları Kaydet</Button>
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
                    <Button className="w-full" variant="outline">
                      <LucideIcons.Download className="w-4 h-4 mr-2" />
                      Yedek Oluştur
                    </Button>
                    <Button className="w-full" variant="outline">
                      <LucideIcons.Upload className="w-4 h-4 mr-2" />
                      Yedek Geri Yükle
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yedek Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: '25.12.2024 14:30', size: '2.4 MB', type: 'Otomatik' },
                      { date: '24.12.2024 14:30', size: '2.3 MB', type: 'Otomatik' },
                      { date: '23.12.2024 10:15', size: '2.1 MB', type: 'Manuel' },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{backup.date}</p>
                          <p className="text-xs text-muted-foreground">{backup.type} - {backup.size}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <LucideIcons.Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <LucideIcons.RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
