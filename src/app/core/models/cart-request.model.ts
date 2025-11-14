/**
 * Interfaz para la petición de agregar un producto al carrito
 */
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

