/**
 * Interfaz que representa la respuesta de un producto del backend.
 * Incluye información del producto y su categoría.
 */
export interface ProductResponse {
  id: number;
  categoryName: string;
  categoryDescription?: string;
  name: string;
  description: string;
  unitValue: number;
  iva: number;
  ivaAmount: number;
  totalPrice: number;
  active: boolean;
  imageUrl?: string;
  estadoProductoId?: number;
  categoryId?: number;
  stock?: number; 
  
  createdAt?: string;
}

