import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { MENU_ITEMS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : <LucideIcons.Circle className="w-4 h-4" />;
  };

  const isActiveLink = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const toggleMenu = (key: string) => {
    setExpandedMenu(expandedMenu === key ? null : key);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 z-50 md:z-auto",
        "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700",
        "shadow-lg md:shadow-none",
        "transform transition-transform duration-200 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 bg-primary">
            <h1 className="text-xl font-bold text-white">HaberPanel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {MENU_ITEMS.map((item) => (
              <div key={item.key}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className={cn(
                        "sidebar-link w-full justify-between",
                        expandedMenu === item.key && "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center">
                        {getIcon(item.icon)}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      <LucideIcons.ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        expandedMenu === item.key && "rotate-180"
                      )} />
                    </button>
                    {expandedMenu === item.key && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link key={child.key} href={child.path}>
                            <div className={cn(
                              "block px-3 py-1 text-sm rounded transition-colors cursor-pointer",
                              isActiveLink(child.path)
                                ? "text-primary bg-blue-50 dark:bg-blue-900/20 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}>
                              {child.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.path}>
                    <div className={cn(
                      "sidebar-link cursor-pointer",
                      isActiveLink(item.path) && "sidebar-link-active"
                    )}>
                      {getIcon(item.icon)}
                      <span className="ml-3">{item.label}</span>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LucideIcons.LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
