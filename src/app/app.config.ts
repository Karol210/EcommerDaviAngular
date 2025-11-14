import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

/**
 * Tema personalizado de PrimeNG basado en Aura.
 * Los colores deben coincidir con las variables CSS definidas en styles.scss
 */
const DaviviendaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{red.500}',         // Equivalente a --red-main
          contrastColor: '{surface.0}',  // Blanco
          hoverColor: '{red.700}',       // Equivalente a --red-dark
          activeColor: '{red.700}'       // Equivalente a --red-dark
        },
        highlight: {
          background: '{red.50}',       // Equivalente a --red-extralight
          focusBackground: '{red.50}',
          color: '{red.700}',           // Equivalente a --red-dark
          focusColor: '{red.700}'
        }
      }
    }
  }
});

/**
 * Configuración principal de la aplicación Angular.
 * Incluye providers para routing, HTTP, animaciones y PrimeNG.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: DaviviendaPreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false
        }
      }
    })
  ]
};
