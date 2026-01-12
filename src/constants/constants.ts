export const PATHS = {
  home: '/',
  feed: '/feed',
  login: '/login',
  register: '/register',
  forgot: '/forgot-password',
  reset: '/reset-password',
  profile: '/profile',
  profileOrders: '/profile/orders',
  ingredient: '/ingredients/:id',
  feedOrder: '/feed/:number',
  profileOrder: '/profile/orders/:number'
} as const;

export const MAX_INGREDIENTS = 6;
