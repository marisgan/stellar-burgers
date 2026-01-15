export const ALIASES = {
  getIngredients: 'getIngredients',
  getUser: 'getUser',
  createOrder: 'createOrder',
  refreshToken: 'refreshToken'
} as const;

export type Alias = (typeof ALIASES)[keyof typeof ALIASES];
