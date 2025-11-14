# Davivienda Marketplace - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
src/app/
├── core/                           # Funcionalidad core de la aplicación
│   ├── enums/                      # Enumeradores
│   │   ├── app-routes.enum.ts     # Rutas de la aplicación
│   │   └── storage-keys.enum.ts   # Claves de storage
│   ├── guards/                     # Guards de rutas
│   │   └── admin-auth.guard.ts    # Protección rutas admin
│   ├── models/                     # Modelos e interfaces
│   │   ├── user.model.ts          # Usuario y autenticación
│   │   └── product.model.ts       # Productos y carrito
│   └── services/                   # Servicios globales
│       ├── auth.service.ts        # Autenticación
│       ├── cart.service.ts        # Carrito de compras
│       └── product.service.ts     # Gestión de productos
│
├── shared/                         # Componentes compartidos
│   └── components/
│       └── header/                # Header del landing
│
├── pages/                          # Páginas de la aplicación
│   ├── landing/                   # Página principal (e-commerce)
│   │   ├── landing.component.ts
│   │   ├── landing.component.html
│   │   └── landing.component.scss
│   │
│   └── admin/                     # Experiencia de administrador
│       ├── admin.routes.ts        # Rutas del admin
│       ├── login/                 # Login del admin
│       ├── layout/                # Layout con menú lateral
│       └── dashboard/             # Dashboard del admin
│
├── app.component.ts               # Componente raíz
├── app.config.ts                  # Configuración de la app
└── app.routes.ts                  # Rutas principales
```

## 🎯 Experiencias de Usuario

### 1. Experiencia Principal (Landing/E-commerce)

**Ruta:** `/`

**Características:**
- Header con botones de "Iniciar Sesión" y "Carrito"
- Catálogo de productos con grid responsivo
- Funcionalidad de agregar al carrito
- Productos obtenidos desde servicio
- Notificaciones toast al agregar productos
- Loading skeletons mientras cargan productos

**Componentes:**
- `LandingComponent`: Página principal
- `HeaderComponent`: Header compartido
- `ProductService`: Servicio de productos
- `CartService`: Gestión del carrito

### 2. Experiencia de Administrador

**Ruta:** `/admin`

**Características:**
- Login con usuario y contraseña
- Layout con menú lateral persistente
- Dashboard con estadísticas
- Protección de rutas con guard
- Opciones de menú: Dashboard, Productos, Pedidos
- Cierre de sesión

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

**Componentes:**
- `AdminLoginComponent`: Login del admin
- `AdminLayoutComponent`: Layout con sidebar
- `AdminDashboardComponent`: Panel principal
- `adminAuthGuard`: Guard de protección

## 🚀 Tecnologías Utilizadas

- **Angular 19** con características modernas:
  - Nueva sintaxis de control de flujo (`@if`, `@for`, `@switch`)
  - Signals para reactividad
  - Componentes standalone
  - Función `inject()` para DI
  - Lazy loading de rutas

- **PrimeNG 19.1.4** para componentes UI:
  - Button, Card, Table
  - Menu, Avatar
  - Toast, Skeleton
  - Input, Password

- **Sistema de diseño Davivienda**:
  - Variables CSS personalizadas
  - Paleta de colores completa
  - Tipografías Davivienda

## 📝 Buenas Prácticas Implementadas

### 1. Enumeradores y Constantes
- Todas las rutas en `AppRoutes` enum
- Claves de storage en `StorageKeys` enum
- Sin valores hardcodeados

### 2. Variables CSS
- Sistema de colores completo en `:root`
- Uso de `var(--color-name)` en todos los estilos
- Sin colores hardcodeados (#xxx)

### 3. Angular 19 Features
```typescript
// Nueva sintaxis de control
@if (loading()) {
  <p-skeleton />
} @else {
  <content />
}

// Signals para reactividad
count = signal(0);
doubled = computed(() => this.count() * 2);

// Función inject()
private router = inject(Router);
```

### 4. Componentes Standalone
Todos los componentes son standalone con imports explícitos:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonModule, CardModule],
  // ...
})
```

### 5. Lazy Loading
```typescript
{
  path: 'admin',
  loadChildren: () => import('./pages/admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
}
```

## 🎨 Sistema de Colores y Tema

### Colores del Sistema

El proyecto utiliza un sistema de diseño completo con variables CSS:

- **Colores principales:** Red, Blue, Green, Orange
- **Colores secundarios:** Yellow, Violet, Turquoise, Gold
- **Colores neutros:** Black, Gray, Gray-Blue
- **Cada familia tiene 4 tonalidades:** dark, main, light, extralight

Ver `.cursor/rules/variables-css-colores.md` para la guía completa.

### Tema PrimeNG v19

PrimeNG v19 usa un sistema de Design Tokens configurado en `app.config.ts`:

- Tema base: **Aura**
- Personalizado con `definePreset` usando colores de Davivienda
- Sistema basado en JavaScript, no CSS
- Preset `DaviviendaPreset` con color primario `#E1111C`
- **NO se usa `::ng-deep`** en componentes individuales
- Tema consistente automáticamente

Ver `.cursor/rules/primeng-v19-temas.md` para detalles del nuevo sistema.

## 🔒 Autenticación y Seguridad

### Admin
- Login protegido en `/admin/login`
- Rutas protegidas con `adminAuthGuard`
- Token y usuario almacenados en `sessionStorage`
- Logout limpia sesión y redirige al login

### Usuario (próximamente)
- Sistema de autenticación para clientes
- Gestión de sesión con tokens

## 🛒 Carrito de Compras

- Estado manejado con Signals
- Persistencia en `localStorage`
- Contador en header del landing
- Operaciones: agregar, eliminar, actualizar cantidad
- Totales calculados con `computed()`

## 📦 Servicios Principales

### AuthService
```typescript
- adminLogin(credentials): Promise<boolean>
- adminLogout(): void
- adminUser: Signal<User | null>
- isAdminAuthenticated: Signal<boolean>
```

### CartService
```typescript
- addToCart(product, quantity): void
- removeFromCart(productId): void
- updateQuantity(productId, quantity): void
- clearCart(): void
- totalItems: Signal<number>
- totalPrice: Signal<number>
```

### ProductService
```typescript
- loadProducts(): void
- getProductById(id): Product | undefined
- getFeaturedProducts(): Product[]
- products: Signal<Product[]>
- loading: Signal<boolean>
```

## 🚦 Rutas Configuradas

```typescript
/                    → Landing (público)
/admin/login         → Login Admin (público)
/admin              → Redirect a /admin/dashboard
/admin/dashboard     → Dashboard (protegido)
/admin/products      → Productos (protegido)
/admin/orders        → Pedidos (protegido)
```

## 🏃 Comandos Disponibles

```bash
# Desarrollo
npm start

# Build producción
npm run build

# Tests
npm test
```

## 📖 Reglas de Desarrollo

El proyecto incluye reglas de desarrollo en `.cursor/rules/`:

1. **angular-primeng-best-practices.md** - Guía de Angular 19 + PrimeNG
2. **enumeradores-constantes.md** - Uso de enums y constantes
3. **variables-css-colores.md** - Sistema de colores
4. **meta-reglas-escritura.md** - Cómo escribir buenas reglas
5. **primeng-v19-temas.md** - Sistema de temas de PrimeNG v19 (Design Tokens)
6. **primeng-tema-personalizado.md** - Referencia de conceptos de temas (deprecado para v19)
7. **documentacion-codigo.md** - Documentación TypeScript/SCSS

## 🔄 Próximos Pasos

- [ ] Implementar página del carrito completa
- [ ] Login de usuarios (no admin)
- [ ] Detalle de producto
- [ ] Proceso de checkout
- [ ] Gestión de productos en admin
- [ ] Gestión de pedidos en admin
- [ ] Integración con API real

## 👨‍💻 Desarrollo

Este proyecto sigue las mejores prácticas de Angular 19 y utiliza un sistema de diseño robusto basado en variables CSS. Todas las nuevas funcionalidades deben seguir las reglas establecidas en `.cursor/rules/`.

---

**Versión:** 1.0.0  
**Angular:** 19.2.0  
**PrimeNG:** 19.1.4

