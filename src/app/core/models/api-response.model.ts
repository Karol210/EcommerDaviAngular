/**
 * Respuesta genérica del backend que encapsula todas las respuestas de la API.
 * @template T Tipo del contenido de la respuesta (body)
 */
export interface ApiResponse<T> {
  failure: boolean;
  code: number;
  message: string;
  body: T;
  timestamp: string;
}

