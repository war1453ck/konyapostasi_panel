export const NEWS_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled'
} as const;

export const NEWS_STATUS_LABELS = {
  [NEWS_STATUS.DRAFT]: 'Taslak',
  [NEWS_STATUS.REVIEW]: 'İncelemede',
  [NEWS_STATUS.PUBLISHED]: 'Yayında',
  [NEWS_STATUS.SCHEDULED]: 'Programlı'
} as const;

export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const COMMENT_STATUS_LABELS = {
  [COMMENT_STATUS.PENDING]: 'Beklemede',
  [COMMENT_STATUS.APPROVED]: 'Onaylandı',
  [COMMENT_STATUS.REJECTED]: 'Reddedildi'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  WRITER: 'writer'
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Yönetici',
  [USER_ROLES.EDITOR]: 'Editör',
  [USER_ROLES.WRITER]: 'Yazar'
} as const;

// Get menu items from localStorage or use defaults
const getStoredMenuOrder = () => {
  try {
    const stored = localStorage.getItem('menuOrder');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const DEFAULT_MENU_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'BarChart3',
    order: 1,
    visible: true,
    group: 'main'
  },
  {
    key: 'content',
    label: 'İçerik Yönetimi',
    icon: 'FileText',
    order: 2,
    visible: true,
    group: 'content',
    children: [
      {
        key: 'news',
        label: 'Haberler',
        path: '/news',
        icon: 'FileText',
        order: 1,
        visible: true,
      },
      {
        key: 'newspaper',
        label: 'Dijital Gazete',
        path: '/newspaper',
        icon: 'Newspaper',
        order: 2,
        visible: true,
      },
      {
        key: 'digital-magazine',
        label: 'Dijital Dergi',
        path: '/digital-magazine',
        icon: 'BookOpen',
        order: 3,
        visible: true,
      },
      {
        key: 'magazine-categories',
        label: 'Dergi Kategorileri',
        path: '/magazine-categories',
        icon: 'Bookmark',
        order: 4,
        visible: true,
      },
      {
        key: 'articles',
        label: 'Makaleler',
        path: '/articles',
        icon: 'PenTool',
        order: 5,
        visible: true,
      },
      {
        key: 'categories',
        label: 'Kategoriler',
        path: '/categories',
        icon: 'Tags',
        order: 6,
        visible: true,
      },
      {
        key: 'comments',
        label: 'Yorumlar',
        path: '/comments',
        icon: 'MessageSquare',
        order: 7,
        visible: true,
      },
    ],
  },
  {
    key: 'ads',
    label: 'Reklam & İlanlar',
    icon: 'Megaphone',
    order: 3,
    visible: true,
    group: 'ads',
    children: [
      {
        key: 'advertisements',
        label: 'Reklamlar',
        path: '/advertisements',
        icon: 'Megaphone',
        order: 1,
        visible: true,
      },
      {
        key: 'classified-ads',
        label: 'İlanlar',
        path: '/classified-ads',
        icon: 'ShoppingBag',
        order: 2,
        visible: true,
      },
    ],
  },
  {
    key: 'management',
    label: 'Yönetim',
    icon: 'Users',
    order: 4,
    visible: true,
    group: 'management',
    children: [
      {
        key: 'users',
        label: 'Kullanıcılar',
        path: '/users',
        icon: 'Users',
        order: 1,
        visible: true,
      },
      {
        key: 'media',
        label: 'Medya',
        path: '/media',
        icon: 'Image',
        order: 2,
        visible: true,
      },
    ],
  },
  {
    key: 'tools',
    label: 'Araçlar',
    icon: 'Wrench',
    order: 5,
    visible: true,
    group: 'tools',
    children: [
      {
        key: 'seo',
        label: 'SEO',
        path: '/seo',
        icon: 'Search',
        order: 1,
        visible: true,
      },
      {
        key: 'analytics',
        label: 'Analitik',
        path: '/analytics',
        icon: 'TrendingUp',
        order: 2,
        visible: true,
      },
    ],
  },
  {
    key: 'system',
    label: 'Sistem',
    icon: 'Settings',
    order: 6,
    visible: true,
    group: 'system',
    children: [
      {
        key: 'menu-settings',
        label: 'Menü Ayarları',
        path: '/menu-settings',
        icon: 'Menu',
        order: 1,
        visible: true,
      },
      {
        key: 'settings',
        label: 'Genel Ayarlar',
        path: '/settings',
        icon: 'Settings',
        order: 2,
        visible: true,
      },
    ],
  },
];

// Apply stored menu order if available
const applyStoredOrder = (items: any[]) => {
  const stored = getStoredMenuOrder();
  if (!stored) return items;
  
  return items.map(item => {
    const storedItem = stored.find((s: any) => s.id === item.key);
    if (storedItem) {
      return {
        ...item,
        label: storedItem.label || item.label,
        order: storedItem.order || item.order,
        visible: storedItem.visible !== undefined ? storedItem.visible : item.visible,
      };
    }
    return item;
  }).sort((a, b) => (a.order || 0) - (b.order || 0)).filter(item => item.visible !== false);
};

export const MENU_ITEMS = applyStoredOrder(DEFAULT_MENU_ITEMS);
