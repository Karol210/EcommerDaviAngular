/**
 * Modelo para el cálculo de precios de un item del carrito
 */
export interface CartItemCalculation {
  unitValue: number;
  ivaPercentage: number;
  quantity: number;
  subtotal: number;
  ivaAmount: number;
  totalPrice: number;
}

/**
 * Modelo para un item del carrito en el resumen
 */
export interface CartItemSummary {
  id: number;
  productId?: number;
  productName: string;
  productDescription: string;
  imageUrl?: string;
  calculation: CartItemCalculation;
}

/**
 * Modelo para el resumen completo del carrito
 */
export interface CartSummary {
  empty: boolean;
  itemCount: number;
  items: CartItemSummary[];
  totalItems: number;
  totalSubtotal: number;
  totalIva: number;
  totalPrice: number;
}

