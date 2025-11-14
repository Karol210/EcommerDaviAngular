/**
 * Mensajes de la aplicación.
 * Centralizados para facilitar mantenimiento y futuras traducciones.
 */
export const Messages = {
  SUCCESS: {
    PRODUCT_ADDED: 'Producto agregado al carrito',
    PRODUCT_REMOVED: 'Producto eliminado del carrito',
    PRODUCT_CREATED: 'Producto creado correctamente',
    PRODUCT_UPDATED: 'Producto actualizado correctamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    REGISTER_SUCCESS: 'Registro exitoso',
    QUANTITY_UPDATED: 'Cantidad actualizada',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
    DATA_SAVED: 'Datos guardados correctamente'
  },
  ERROR: {
    ADD_TO_CART_FAILED: 'No se pudo agregar el producto al carrito',
    REMOVE_FROM_CART_FAILED: 'No se pudo eliminar el producto',
    UPDATE_QUANTITY_FAILED: 'No se pudo actualizar la cantidad',
    LOGIN_FAILED: 'Credenciales inválidas',
    REGISTER_FAILED: 'No se pudo completar el registro',
    LOAD_PRODUCTS_FAILED: 'Error al cargar productos',
    LOAD_CART_FAILED: 'Error al cargar el carrito',
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    SERVER_ERROR: 'Error del servidor. Intente nuevamente',
    NETWORK_ERROR: 'Error de conexión',
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
    UNAUTHORIZED: 'No tiene permisos para realizar esta acción'
  },
  INFO: {
    LOGIN_REQUIRED: 'Debe iniciar sesión para continuar',
    EMPTY_CART: 'El carrito está vacío',
    LOADING: 'Cargando...',
    NO_PRODUCTS: 'No hay productos disponibles'
  },
  CONFIRM: {
    DELETE_PRODUCT: '¿Está seguro que desea eliminar este producto?',
    LOGOUT: '¿Está seguro que desea cerrar sesión?',
    REMOVE_FROM_CART: '¿Eliminar este producto del carrito?',
    DISCARD_CHANGES: '¿Desea descartar los cambios?'
  }
} as const;

/**
 * Títulos de mensajes para PrimeNG Toast.
 */
export const MessageTitles = {
  SUCCESS: 'Éxito',
  ERROR: 'Error',
  INFO: 'Información',
  WARNING: 'Advertencia',
  CONFIRM: 'Confirmar'
} as const;

