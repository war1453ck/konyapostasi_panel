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
  
  const [notifications, setNotifications] = useState([
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

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read first
    markAsRead(notification.id);
    
    // Then navigate
    switch(notification.type) {
      case 'news':
        window.location.href = '/news';
        break;
      case 'category':
        window.location.href = '/categories';
        break;
      case 'comment':
        window.location.href = '/comments';
        break;
      case 'magazine':
        window.location.href = '/magazine-categories';
        break;
      default:
        break;
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
            <DropdownMenuContent align="end" className="w-72 sm:w-80 max-w-[90vw]">
              <DropdownMenuLabel className="flex items-center justify-between p-3">
                <span className="font-medium">Bildirimler</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} okunmamış
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 last:border-b-0 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-base sm:text-lg flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{notification.title}</p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center">
                          <LucideIcons.Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{notification.time}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-6 text-center">
                    <LucideIcons.Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Henüz bildirim yok</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 flex gap-2">
                <button 
                  className="flex-1 text-center text-sm text-muted-foreground hover:text-foreground py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                  onClick={() => window.location.href = '/notifications'}
                >
                  Tüm bildirimleri görüntüle
                </button>
                {unreadCount > 0 && (
                  <button 
                    className="text-sm text-muted-foreground hover:text-foreground py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setNotifications(prev => 
                        prev.map(notification => ({ ...notification, read: true }))
                      );
                    }}
                  >
                    Tümünü okundu işaretle
                  </button>
                )}
              </div>
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
