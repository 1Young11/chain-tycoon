import { APP_ERROR_CODES, APP_ERROR_MESSAGES, type AppErrorCode } from '@/constants/app-errors';

export type AppError = {
   name: 'AppError';
   code: AppErrorCode;
   message: string;
} & Error;

export const createAppError = (code: AppErrorCode, message = APP_ERROR_MESSAGES[code]): AppError => {
   return Object.assign(new Error(message), {
      name: 'AppError' as const,
      code,
   });
};

export const getAppErrorMessage = (error: unknown, fallback = APP_ERROR_MESSAGES[APP_ERROR_CODES.unknown]) => {
   if (error instanceof Error) {
      return error.message;
   }

   return fallback;
};
