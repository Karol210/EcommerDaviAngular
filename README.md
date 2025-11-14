# Davivienda Marketplace

Aplicación Angular para gestión de productos y marketplace, desarrollada con Angular 19.2.19 y PrimeNG.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Construcción](#construcción)

## ✨ Características

- 🛍️ **Landing Page**: Catálogo de productos con sistema de carrito
- 👨‍💼 **Panel de Administración**: Gestión completa de productos
- 🔐 **Autenticación**: Sistema de login para administradores
- 🎨 **UI Moderna**: Interfaz construida con PrimeNG
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ⚡ **Reactivo**: Uso de Signals de Angular para estado reactivo

## 🛠️ Tecnologías

- **Angular** 19.2.19
- **PrimeNG** - Biblioteca de componentes UI
- **TypeScript** - Tipado estático
- **SCSS** - Estilos con preprocesador
- **RxJS** - Programación reactiva
- **Signals** - Estado reactivo de Angular

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Núcleo de la aplicación
│   │   ├── enums/              # Enumeradores
│   │   ├── guards/             # Guards de autenticación
│   │   ├── models/             # Modelos e interfaces
│   │   └── services/           # Servicios HTTP
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── admin/              # Módulo de administración
│   │   └── landing/            # Landing page pública
│   └── shared/                  # Componentes compartidos
├── environments/                # Configuración de entornos
└── themes/                      # Temas y estilos globales
```

## 📚 Guías de Desarrollo

Este proyecto utiliza **Cursor Rules** para mantener consistencia en el código.

### 📘 Cursor Rules (`.cursor/rules/`)
El directorio `.cursor/rules/` contiene reglas que el asistente de IA sigue automáticamente.

**Regla clave para servicios HTTP:**
- `servicios-http-api.md` - Implementación de servicios HTTP y APIs REST

**Estas reglas se aplican automáticamente al desarrollar con Cursor.**

## ⚙️ Configuración

### Prerequisitos

- Node.js 18.x o superior
- npm 9.x o superior
- Angular CLI 19.x

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar src/environments/environment.ts con la URL de tu backend
```

### Variables de Entorno

Configurar la URL del backend en los archivos de environment:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

## 🚀 Desarrollo

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

Navegar a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

### Rutas de la Aplicación

- `/` - Landing page con catálogo de productos
- `/admin/login` - Login de administrador
- `/admin/dashboard` - Panel de administración (requiere autenticación)

### Generación de Código

Angular CLI incluye herramientas poderosas para scaffolding:

```bash
# Generar un componente
ng generate component components/nombre-componente

# Generar un servicio
ng generate service services/nombre-servicio

# Generar un guard
ng generate guard guards/nombre-guard

# Ver todas las opciones disponibles
ng generate --help
```

## 🏗️ Construcción

### Build de Desarrollo

```bash
ng build
```

### Build de Producción

```bash
ng build --configuration production
```

Los artefactos de compilación se almacenarán en el directorio `dist/`. La build de producción optimiza automáticamente la aplicación para rendimiento y velocidad.

## 🧪 Pruebas

### Pruebas Unitarias

Para ejecutar las pruebas unitarias con [Karma](https://karma-runner.github.io):

```bash
ng test
```

### Pruebas End-to-End

Para pruebas e2e:

```bash
ng e2e
```

## 📝 Convenciones de Código

### Servicios HTTP

Al implementar nuevos servicios que consumen APIs REST, las **Cursor Rules** aseguran automáticamente:

1. Creación de archivos de tipado (`-response.ts`, `-request.ts` si aplica)
2. Uso de `ApiResponse<T>` para todas las respuestas
3. Configuración correcta de headers con `getHeaders()`
4. Agrupación de endpoints por dominio en `baseUrl`
5. Implementación de `catchError` en todos los métodos HTTP
6. Documentación con JSDoc

Las reglas completas están en [.cursor/rules/servicios-http-api.md](./.cursor/rules/servicios-http-api.md)

### Estructura de Componentes

- Usar componentes standalone
- Implementar signals para estado reactivo
- Seguir principios SOLID y patrón BEM para CSS
- Documentar componentes complejos con JSDoc

### Nomenclatura

- **Archivos**: kebab-case (ej: `product-service.ts`)
- **Clases**: PascalCase (ej: `ProductService`)
- **Variables/Métodos**: camelCase (ej: `getProducts()`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_URL`)
- **Interfaces**: PascalCase (ej: `Product`, `ProductResponse`)

## 🔐 Autenticación

El sistema usa autenticación basada en JWT:

1. Login en `/admin/login` con credenciales
2. Token almacenado en `sessionStorage`
3. Token enviado en header `Authorization: Bearer {token}`
4. Guards protegen rutas de administración

## 🌐 API Backend

La aplicación consume una API REST. Configurar la URL base en `environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api/v1'
};
```

### Endpoints Principales

- `GET /products/list-all` - Lista todos los productos
- `POST /auth/login` - Autenticación de administrador
- Ver documentación del backend para endpoints completos

## 📖 Recursos Adicionales

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Signals](https://angular.dev/guide/signals)
- [PrimeNG Documentation](https://primeng.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 👥 Contribución

1. Crear una rama feature desde `main`
2. Hacer commits con mensajes descriptivos
3. Seguir las guías de desarrollo del proyecto
4. Crear Pull Request para revisión

## 📄 Licencia

Este proyecto es propiedad de Davivienda.
