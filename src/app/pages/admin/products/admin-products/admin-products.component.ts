import { Component, inject, signal, computed, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Product } from '../../../../core/models/product.model';
import { ProductRequest } from '../../../../core/models/product-request';

type TabType = 'problems' | 'available';

/**
 * Componente de administración de productos.
 * Permite visualizar, crear, editar y eliminar productos del inventario.
 * 
 * Organiza los productos en dos categorías:
 * - Productos disponibles: activos y con stock adecuado (>= 10 unidades)
 * - Productos con problemas: inactivos o con stock bajo (< 10 unidades)
 * 
 * @todo Implementar modal para crear producto
 * @todo Implementar modal para editar producto
 * @todo Conectar con endpoints del backend para operaciones CRUD
 */
@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    InputTextarea,
    TableModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  
  /** Signal que controla el tab activo ('available' o 'problems') */
  readonly activeTab = signal<TabType>('available');
  
  /** Signal que controla la visibilidad del modal de crear producto */
  readonly showCreateModal = signal(false);
  
  /** Signal que indica si el formulario está siendo enviado */
  readonly submitting = signal(false);
  
  /** Signal reactivo con las categorías disponibles */
  readonly categories = this.categoryService.categories;
  
  /** Signal reactivo que indica si las categorías están cargando */
  readonly loadingCategories = this.categoryService.loading;
  
  /** Formulario reactivo para crear producto */
  readonly productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    unitValue: [0, [Validators.required, Validators.min(1)]],
    iva: [19, [Validators.required, Validators.min(0), Validators.max(100)]],
    imageUrl: [''],
    inventory: [0, [Validators.required, Validators.min(0)]],
    categoryName: ['', [Validators.required]],
    estadoProductoId: [1, [Validators.required]]
  });
  
  /** Signal computado con productos que tienen problemas (inactivos o stock bajo) */
  readonly problemProducts = computed(() => this.productService.getProblemsProducts());
  
  /** Signal computado con productos disponibles (activos con stock adecuado) */
  readonly availableProducts = computed(() => this.productService.getAvailableProducts());
  
  /**
   * Signal computado que retorna los productos a mostrar según el tab activo.
   * Se actualiza automáticamente cuando cambia activeTab o los productos.
   */
  readonly displayedProducts = computed(() => {
    return this.activeTab() === 'problems' 
      ? this.problemProducts() 
      : this.availableProducts();
  });
  
  /** Signal computado que indica si los productos están cargando */
  readonly loading = computed(() => this.productService.loading());

  ngOnInit(): void {
    // Cargar TODOS los productos (activos e inactivos) para administración
    this.productService.loadAllProductsForAdmin();
  }

  /**
   * Cambia el tab activo entre 'available' y 'problems'.
   * 
   * @param tab - El tab a activar
   */
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  /**
   * Refresca la lista de productos forzando una nueva carga desde el backend.
   * Usa refreshAllProducts para cargar todos los productos (activos e inactivos).
   */
  refreshProducts(): void {
    this.productService.refreshAllProducts();
  }

  /**
   * Obtiene el estado del producto como texto legible.
   * 
   * @param product - Producto a evaluar
   * @returns String con el estado: 'Inactivo', 'Sin stock', 'Stock bajo (X)' o 'Disponible'
   */
  getProductStatus(product: Product): string {
    if (!product.active) {
      return 'Inactivo';
    }
    if (product.stock !== undefined && product.stock === 0) {
      return 'Sin stock';
    }
    if (product.stock !== undefined && product.stock < 10) {
      return `Stock bajo (${product.stock})`;
    }
    return 'Disponible';
  }

  /**
   * Obtiene la clase CSS correspondiente al estado del producto.
   * Usada para aplicar colores diferentes según el estado.
   * 
   * @param product - Producto a evaluar
   * @returns Clase CSS: 'status-inactive', 'status-no-stock', 'status-low-stock' o 'status-available'
   */
  getStatusClass(product: Product): string {
    if (!product.active) {
      return 'status-inactive';
    }
    if (product.stock !== undefined && product.stock === 0) {
      return 'status-no-stock';
    }
    if (product.stock !== undefined && product.stock < 10) {
      return 'status-low-stock';
    }
    return 'status-available';
  }

  /**
   * Formatea un número como moneda colombiana (COP).
   * 
   * @param price - Precio a formatear
   * @returns String formateado como "$X.XXX.XXX" sin decimales
   * 
   * @example
   * formatPrice(2500000) // "$2.500.000"
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Formatea una fecha ISO en formato legible en español.
   * 
   * @param dateString - Fecha en formato ISO 8601
   * @returns Fecha formateada como "dd MMM yyyy" o "N/A" si no hay fecha
   * 
   * @example
   * formatDate('2025-11-13T15:28:37.413993') // "13 nov 2025"
   */
  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  }

  /**
   * Inicia el flujo de creación de un nuevo producto.
   * Abre el modal con el formulario de creación.
   */
  createProduct(): void {
    this.productForm.reset({
      name: '',
      description: '',
      unitValue: 0,
      iva: 19,
      imageUrl: '',
      inventory: 0,
      categoryName: '',
      estadoProductoId: 1
    });
    this.showCreateModal.set(true);
  }

  /**
   * Cierra el modal de creación de producto.
   */
  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.productForm.reset();
  }

  /**
   * Envía el formulario de creación de producto al backend.
   * Muestra mensaje de éxito o error según el resultado.
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const productRequest = this.productForm.value as ProductRequest;

    this.productService.create(productRequest).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.showCreateModal.set(false);
        this.productForm.reset();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message || 'Producto creado exitosamente',
          life: 3000
        });
      },
      error: (error) => {
        this.submitting.set(false);
        console.error('Error al crear producto:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el producto. Intenta nuevamente.',
          life: 5000
        });
      }
    });
  }

  // Edita un producto existente
  editProduct(product: Product): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'La edición de productos estará disponible próximamente',
      life: 3000
    });
  }

  // Elimina un producto
  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // TODO: Implementar eliminación real
        this.messageService.add({
          severity: 'success',
          summary: 'Producto eliminado',
          detail: `El producto "${product.name}" ha sido eliminado`,
          life: 3000
        });
      }
    });
  }

  // Activa o desactiva un producto
  toggleProductStatus(product: Product): void {
    const action = product.active ? 'desactivar' : 'activar';
    
    this.confirmationService.confirm({
      message: `¿Deseas ${action} el producto "${product.name}"?`,
      header: `Confirmar ${action}ción`,
      icon: 'pi pi-question-circle',
      acceptLabel: `Sí, ${action}`,
      rejectLabel: 'Cancelar',
      accept: () => {
        // TODO: Implementar toggle real
        this.messageService.add({
          severity: 'success',
          summary: 'Estado actualizado',
          detail: `El producto "${product.name}" ha sido ${action === 'activar' ? 'activado' : 'desactivado'}`,
          life: 3000
        });
        this.refreshProducts();
      }
    });
  }

  // Muestra los detalles del producto
  viewProduct(product: Product): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'La vista detallada de productos estará disponible próximamente',
      life: 3000
    });
  }
}
