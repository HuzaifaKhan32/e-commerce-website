// utils/errorHandler.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): { message: string; status: number } => {
  if (error instanceof AppError) {
    return { message: error.message, status: error.statusCode };
  }

  if (error.status && error.message) {
    return { message: error.message, status: error.status };
  }

  // Network errors or other unexpected errors
  return { 
    message: error.message || 'An unexpected error occurred', 
    status: error.status || 500 
  };
};

export const validateInput = (data: any, requiredFields: string[]): string | null => {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      return `${field} is required`;
    }
  }
  return null;
};