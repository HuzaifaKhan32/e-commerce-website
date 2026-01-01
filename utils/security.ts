// utils/security.ts
import validator from 'validator';

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return validator.escape(input.trim());
};

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic phone number validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateUrl = (url: string): boolean => {
  return validator.isURL(url, { 
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  });
};

export const validateString = (str: string, options: { min?: number; max?: number; pattern?: RegExp } = {}): boolean => {
  if (typeof str !== 'string') return false;
  
  if (options.min && str.length < options.min) return false;
  if (options.max && str.length > options.max) return false;
  if (options.pattern && !options.pattern.test(str)) return false;
  
  return true;
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization (in production, use a proper library like DOMPurify)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};