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

export const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'BarChart3',
    path: '/',
    key: 'dashboard'
  },
  {
    label: 'Haber Yönetimi',
    icon: 'Newspaper',
    key: 'news',
    children: [
      { label: 'Tüm Haberler', path: '/news', key: 'news-list' },
      { label: 'Yeni Haber', path: '/news/new', key: 'news-new' },
      { label: 'Taslaklar', path: '/news?status=draft', key: 'news-drafts' }
    ]
  },
  {
    label: 'Kategoriler',
    icon: 'Tags',
    path: '/categories',
    key: 'categories'
  },
  {
    label: 'Kullanıcılar',
    icon: 'Users',
    path: '/users',
    key: 'users'
  },
  {
    label: 'Medya Kütüphanesi',
    icon: 'Images',
    path: '/media',
    key: 'media'
  },
  {
    label: 'Yorumlar',
    icon: 'MessageSquare',
    path: '/comments',
    key: 'comments'
  },
  {
    label: 'SEO Araçları',
    icon: 'Search',
    path: '/seo',
    key: 'seo'
  },
  {
    label: 'Analitikler',
    icon: 'BarChart',
    path: '/analytics',
    key: 'analytics'
  },
  {
    label: 'Ayarlar',
    icon: 'Settings',
    path: '/settings',
    key: 'settings'
  }
] as const;
