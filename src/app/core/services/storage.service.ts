import { Injectable } from '@angular/core';

/**
 * Servicio para gestionar el almacenamiento en sessionStorage
 * con encriptación/desencriptación automática en Base64.
 * 
 * Este servicio actúa como una capa de abstracción sobre sessionStorage,
 * proporcionando métodos seguros para almacenar y recuperar datos.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Guarda un valor en sessionStorage encriptándolo en Base64.
   * 
   * @param key - Clave con la que se almacenará el valor
   * @param value - Valor a almacenar (string, objeto, número, etc.)
   * @returns true si se guardó exitosamente, false en caso de error
   */
  setItem(key: string, value: any): boolean {
    try {
      // Convertir el valor a string si es un objeto
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      // Encriptar en Base64
      const encryptedValue = this.encryptBase64(stringValue);
      
      // Guardar en sessionStorage
      sessionStorage.setItem(key, encryptedValue);
      
      return true;
    } catch (error) {
      console.error(`Error al guardar en sessionStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * Recupera un valor de sessionStorage y lo desencripta desde Base64.
   * 
   * @param key - Clave del valor a recuperar
   * @returns El valor desencriptado o null si no existe o hay un error
   */
  getItem<T = string>(key: string): T | null {
    try {
      // Obtener el valor encriptado
      const encryptedValue = sessionStorage.getItem(key);
      
      if (!encryptedValue) {
        return null;
      }
      
      // Desencriptar desde Base64
      const decryptedValue = this.decryptBase64(encryptedValue);
      
      // Intentar parsear como JSON si es posible
      try {
        return JSON.parse(decryptedValue) as T;
      } catch {
        // Si no es JSON válido, devolver como string
        return decryptedValue as T;
      }
    } catch (error) {
      console.error(`Error al recuperar de sessionStorage [${key}]:`, error);
      return null;
    }
  }

  /**
   * Elimina un valor específico de sessionStorage.
   * 
   * @param key - Clave del valor a eliminar
   */
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar de sessionStorage [${key}]:`, error);
    }
  }

  /**
   * Limpia completamente el sessionStorage.
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error al limpiar sessionStorage:', error);
    }
  }

  /**
   * Verifica si existe una clave en sessionStorage.
   * 
   * @param key - Clave a verificar
   * @returns true si existe, false en caso contrario
   */
  hasItem(key: string): boolean {
    try {
      return sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error al verificar existencia en sessionStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * Obtiene todas las claves almacenadas en sessionStorage.
   * 
   * @returns Array con todas las claves
   */
  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Error al obtener claves de sessionStorage:', error);
      return [];
    }
  }

  /**
   * Encripta un string a Base64.
   * 
   * @param value - Valor a encriptar
   * @returns String encriptado en Base64
   */
  private encryptBase64(value: string): string {
    try {
      // Usar btoa para encriptar en Base64
      // Para manejar caracteres Unicode, primero codificar en UTF-8
      return btoa(encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (error) {
      console.error('Error al encriptar en Base64:', error);
      throw error;
    }
  }

  /**
   * Desencripta un string desde Base64.
   * 
   * @param encryptedValue - Valor encriptado en Base64
   * @returns String desencriptado
   */
  private decryptBase64(encryptedValue: string): string {
    try {
      // Usar atob para desencriptar desde Base64
      // Luego decodificar desde UTF-8
      return decodeURIComponent(
        Array.from(atob(encryptedValue))
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (error) {
      console.error('Error al desencriptar desde Base64:', error);
      throw error;
    }
  }
}


