import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications] = useState([
    {
      id: 1,
      title: "Yeni haber eklendi",
      description: "YouTube Video Haber Testi başlıklı haber yayınlandı",
      time: "2 dakika önce",
      read: false,
      type: "news"
    },
    {
      id: 2,
      title: "Kategori güncellendi",
      description: "Teknoloji kategorisi başarıyla güncellendi",
      time: "15 dakika önce",
      read: false,
      type: "category"
    },
    {
      id: 3,
      title: "Yeni yorum onayı",
      description: "3 yorum onay bekliyor",
      time: "1 saat önce",
      read: true,
      type: "comment"
    },
    {
      id: 4,
      title: "Dergi kategorisi eklendi",
      description: "Test Bildirim kategorisi başarıyla oluşturuldu",
      time: "5 dakika önce",
      read: false,
      type: "magazine"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'category': return '🏷️';
      case 'comment': return '💬';
      case 'magazine': return '📖';
      default: return '🔔';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-4"
            onClick={onMenuClick}
          >
            <LucideIcons.Menu className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Haber ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
            <LucideIcons.Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <LucideIcons.Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Bildirimler</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} okunmamış
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start space-x-2 flex-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <LucideIcons.Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center text-sm text-muted-foreground">
                Tüm bildirimleri görüntüle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <LucideIcons.Sun className="w-5 h-5" />
            ) : (
              <LucideIcons.Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
