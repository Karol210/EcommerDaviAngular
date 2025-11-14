/**
 * Endpoints de la API REST del backend.
 * Usar siempre estos valores en lugar de strings hardcodeados.
 */
export enum ApiEndpoints {
  // Auth endpoints
  AUTH_LOGIN = '/api/v1/auth/login',
  
  // Products endpoints
  PRODUCTS_LIST_ACTIVE = '/api/v1/products/list-active',
  PRODUCTS_LIST_ALL = '/api/v1/products/list-all',
  PRODUCTS_CREATE = '/api/v1/products/create',
  
  // Categories endpoints
  CATEGORIES_LIST_ALL = '/api/v1/categories/list-all',
  
  // Cart endpoints
  CART_SUMMARY = '/api/v1/cart-items/summary',
  CART_ADD = '/api/v1/cart-items/add',
  CART_REMOVE = '/api/v1/cart-items',
  
  // Users endpoints
  USERS_CREATE = '/api/v1/users/create',
  USERS_ALL = '/api/v1/users/all',
  
  // Document types endpoints
  DOCUMENT_TYPES_ALL = '/api/v1/document-types',
  
  // Payment methods endpoints
  PAYMENTS_PROCESS = '/api/v1/payments/process'
}

