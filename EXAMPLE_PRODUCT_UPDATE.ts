/**
 * EJEMPLO DE USO - Servicio de Actualización de Producto
 * 
 * Este archivo muestra cómo usar el método update() del ProductService
 * siguiendo las reglas del proyecto (encadenamiento en componentes, no en servicios).
 */

import { Component, inject } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import { ProductUpdateRequest } from '../core/models/product-update-request';
import { MessageService } from 'primeng/api';
import { Messages } from '../shared/constants/messages.constants';

/**
 * Ejemplo de componente que actualiza el estado de un producto.
 */
export class ExampleProductUpdateComponent {
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);

  /**
   * Actualiza el estado de un producto.
   * @param productId - ID del producto a actualizar
   * @param newStateId - Nuevo estado del producto
   */
  updateProductState(productId: number, newStateId: number): void {
    const request: ProductUpdateRequest = {
      estadoProductoId: newStateId
    };

    this.productService.update(productId, request).subscribe({
      next: (response) => {
        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message || 'Producto actualizado exitosamente'
        });
        
        // Los productos se recargan automáticamente gracias al tap() en el servicio
        console.log('Producto actualizado:', response);
      },
      error: (error) => {
        // Mostrar mensaje de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el producto'
        });
        
        console.error('Error al actualizar producto:', error);
      }
    });
  }

  /**
   * Ejemplo: Activar un producto (cambiar a estado activo).
   * @param productId - ID del producto a activar
   */
  activateProduct(productId: number): void {
    this.updateProductState(productId, 1); // 1 = Estado Activo
  }

  /**
   * Ejemplo: Desactivar un producto (cambiar a estado inactivo).
   * @param productId - ID del producto a desactivar
   */
  deactivateProduct(productId: number): void {
    this.updateProductState(productId, 2); // 2 = Estado Inactivo
  }

  /**
   * Ejemplo con encadenamiento múltiple:
   * Actualiza el producto y luego realiza otra acción.
   */
  updateAndNotify(productId: number, newStateId: number): void {
    const request: ProductUpdateRequest = {
      estadoProductoId: newStateId
    };

    this.productService.update(productId, request).subscribe({
      next: (response) => {
        // Primera acción: mostrar mensaje
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message
        });

        // Segunda acción: realizar otra operación
        this.onProductUpdated(productId);
      },
      error: (error) => {
        this.handleUpdateError(error);
      }
    });
  }

  private onProductUpdated(productId: number): void {
    // Lógica adicional después de actualizar
    console.log(`Producto ${productId} actualizado exitosamente`);
  }

  private handleUpdateError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar el producto'
    });
  }
}

