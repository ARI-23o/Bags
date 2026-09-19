/**
 * Format number to Turkish Lira (TRY) currency string
 * e.g., 1299.9 -> ₺1.299,90
 */
export const formatTRY = (amount: number | null | undefined, symbol: string = '₺'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${symbol}0,00`;
  }

  const parts = Number(amount).toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1];

  return `${symbol}${integerPart},${decimalPart}`;
};
