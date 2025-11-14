/**
 * Interfaz de producto para uso interno en la aplicación.
 * Se mapea desde ProductResponse del backend.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  categoryDescription?: string;
  unitPrice?: number;
  unitValue?: number;
  taxRate?: number;
  iva?: number;
  taxAmount?: number;
  ivaAmount?: number;
  totalPrice: number;
  imageUrl?: string;
  active: boolean;
  estadoProductoId?: number;
  categoryId?: number;
  stock?: number;
  createdAt?: string;
}

export interface CartItem {
  id: number; // ID del item en el carrito (cartItemId del backend)
  product: Product;
  quantity: number;
}

