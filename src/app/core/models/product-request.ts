/**
 * Interfaz que representa la petición para crear un producto.
 * Incluye todos los campos necesarios para registrar un nuevo producto en el sistema.
 */
export interface ProductRequest {
  name: string;
  description: string;
  unitValue: number;
  iva: number;
  imageUrl?: string;
  inventory: number;
  categoryName: string;
  estadoProductoId: number;
}

