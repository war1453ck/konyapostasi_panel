import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
// Simple drag and drop without external library
// We'll implement a basic version without @hello-pangea/dnd for now
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  visible: boolean;
  order: number;
  group?: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'BarChart3', visible: true, order: 1, group: 'main' },
  { id: 'news', label: 'Haberler', path: '/news', icon: 'FileText', visible: true, order: 2, group: 'content' },
  { id: 'newspaper', label: 'Dijital Gazete', path: '/newspaper', icon: 'Newspaper', visible: true, order: 3, group: 'content' },
  { id: 'articles', label: 'Makaleler', path: '/articles', icon: 'BookOpen', visible: true, order: 4, group: 'content' },
  { id: 'categories', label: 'Kategoriler', path: '/categories', icon: 'Tags', visible: true, order: 5, group: 'content' },
  { id: 'comments', label: 'Yorumlar', path: '/comments', icon: 'MessageSquare', visible: true, order: 6, group: 'content' },
  { id: 'advertisements', label: 'Reklamlar', path: '/advertisements', icon: 'Megaphone', visible: true, order: 7, group: 'ads' },
  { id: 'classified-ads', label: 'İlanlar', path: '/classified-ads', icon: 'ShoppingBag', visible: true, order: 8, group: 'ads' },
  { id: 'users', label: 'Kullanıcılar', path: '/users', icon: 'Users', visible: true, order: 9, group: 'management' },
  { id: 'media', label: 'Medya', path: '/media', icon: 'Image', visible: true, order: 10, group: 'management' },
  { id: 'seo', label: 'SEO', path: '/seo', icon: 'Search', visible: true, order: 11, group: 'tools' },
  { id: 'analytics', label: 'Analitik', path: '/analytics', icon: 'TrendingUp', visible: true, order: 12, group: 'tools' },
  { id: 'settings', label: 'Ayarlar', path: '/settings', icon: 'Settings', visible: true, order: 13, group: 'system' },
];

export default function MenuSettings() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const { toast } = useToast();

  const moveItem = (fromIndex: number, toIndex: number) => {
    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setMenuItems(updatedItems);
  };

  const toggleVisibility = (id: string) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const updateLabel = (id: string, newLabel: string) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, label: newLabel } : item
      )
    );
  };

  const saveMenuOrder = () => {
    // In a real app, this would save to the backend
    localStorage.setItem('menuOrder', JSON.stringify(menuItems));
    toast({
      title: 'Menü Ayarları Kaydedildi',
      description: 'Menü sırası ve görünürlük ayarları başarıyla kaydedildi.',
    });
  };

  const resetToDefault = () => {
    setMenuItems(DEFAULT_MENU_ITEMS);
    localStorage.removeItem('menuOrder');
    toast({
      title: 'Varsayılan Ayarlar Yüklendi',
      description: 'Menü ayarları varsayılan haline getirildi.',
    });
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : <LucideIcons.Circle className="w-4 h-4" />;
  };

  const groupedItems = menuItems.reduce((groups: Record<string, MenuItem[]>, item) => {
    const group = item.group || 'other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});

  const getGroupLabel = (group: string) => {
    switch (group) {
      case 'main': return 'Ana Sayfa';
      case 'content': return 'İçerik Yönetimi';
      case 'ads': return 'Reklam & İlanlar';
      case 'management': return 'Yönetim';
      case 'tools': return 'Araçlar';
      case 'system': return 'Sistem';
      default: return 'Diğer';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menü Ayarları</h1>
          <p className="text-muted-foreground">Navigasyon menüsündeki öğelerin sırasını ve görünürlüğünü yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetToDefault}>
            <LucideIcons.RotateCcw className="w-4 h-4 mr-2" />
            Varsayılana Sıfırla
          </Button>
          <Button onClick={saveMenuOrder}>
            <LucideIcons.Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LucideIcons.Info className="w-5 h-5 mr-2" />
            Nasıl Kullanılır
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Menü öğelerini sürükleyip bırakarak sırasını değiştirebilirsiniz</li>
            <li>• Görünürlük anahtarını kullanarak menü öğelerini gizleyebilir/gösterebilirsiniz</li>
            <li>• Menü etiketlerini düzenlemek için metin kutularını kullanın</li>
            <li>• Gruplar halinde organize edilmiş menü yapısını görüntüleyebilirsiniz</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menu Order Management */}
        <Card>
          <CardHeader>
            <CardTitle>Menü Sırası Yönetimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={item.id} className="p-3 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => index > 0 && moveItem(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 h-6 w-6"
                      >
                        <LucideIcons.ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => index < menuItems.length - 1 && moveItem(index, index + 1)}
                        disabled={index === menuItems.length - 1}
                        className="p-1 h-6 w-6"
                      >
                        <LucideIcons.ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-grow">
                      {getIcon(item.icon)}
                      <Input
                        value={item.label}
                        onChange={(e) => updateLabel(item.id, e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      #{item.order}
                    </Badge>
                    
                    <Switch
                      checked={item.visible}
                      onCheckedChange={() => toggleVisibility(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Menü Önizlemesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([group, items]) => {
                const visibleItems = items.filter(item => item.visible);
                if (visibleItems.length === 0) return null;
                
                return (
                  <div key={group}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {getGroupLabel(group)}
                    </h4>
                    <div className="space-y-1 ml-4">
                      {visibleItems
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <div key={item.id} className="flex items-center space-x-2 py-1">
                            {getIcon(item.icon)}
                            <span className="text-sm">{item.label}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Menü Öğesi</CardTitle>
            <LucideIcons.Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Görünür Öğeler</CardTitle>
            <LucideIcons.Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter(item => item.visible).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gizli Öğeler</CardTitle>
            <LucideIcons.EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter(item => !item.visible).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}