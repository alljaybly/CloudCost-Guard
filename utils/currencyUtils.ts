
import { Currency } from '../types';

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'INR', symbol: '₹' },
    { code: 'CAD', symbol: '$' },
    { code: 'AUD', symbol: '$' },
];

export const DEFAULT_CURRENCY: Currency = SUPPORTED_CURRENCIES[0];

export const formatCurrency = (value: number, currency: Currency): string => {
    try {
        // Use Intl.NumberFormat for more accurate, locale-aware currency formatting in the future
        // For now, a simple symbol + toLocaleString is sufficient for the demo
        return `${currency.symbol}${value.toLocaleString()}`;
    } catch {
        return `${currency.symbol}${value}`;
    }
};
