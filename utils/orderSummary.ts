import { CartItem } from '@/types';

export const FREE_SHIPPING_THRESHOLD = 150;
export const TAX_RATE = 0.08;

export function calculateOrderSummary(items: CartItem[]) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = 0;
  const total = subtotal + tax + shipping;
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return {
    subtotal,
    tax,
    shipping,
    total,
    amountUntilFreeShipping,
    qualifiesForFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
