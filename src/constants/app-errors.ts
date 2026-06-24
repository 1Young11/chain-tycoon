export const APP_ERROR_CODES = {
   client: 'client',
   server: 'server',
   database: 'database',
   unknown: 'unknown',
} as const;

export const APP_ERROR_MESSAGES = {
   [APP_ERROR_CODES.client]: 'Something went wrong on the client. Please try again.',
   [APP_ERROR_CODES.server]: 'Server error. Please try again later.',
   [APP_ERROR_CODES.database]: 'Database error. Please check the data and try again.',
   [APP_ERROR_CODES.unknown]: 'Unexpected error. Please try again.',
} as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[keyof typeof APP_ERROR_CODES];
export type AppErrorMessage = (typeof APP_ERROR_MESSAGES)[AppErrorCode];
