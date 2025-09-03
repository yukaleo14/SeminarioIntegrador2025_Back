import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rutas como públicas
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
