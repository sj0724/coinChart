import { INTERVAL_OPTIONS, SORT_OPTIONS } from '@/types/sort';

export const SORT_MENU: { name: string; value: SORT_OPTIONS }[] = [
  { name: '가격내림차순', value: 'priceDes' },
  { name: '가격오름차순', value: 'priceAsc' },
  { name: '거래량순', value: 'volumeDes' },
];

export const INTERVAL_MENU: INTERVAL_OPTIONS[] = [
  '3m',
  '15m',
  '1h',
  '4h',
  '1d',
  '1w',
];

export const CURRENCY_OPTIONS = [
  'USDT',
  'FDUSD',
  'USDC',
  'BNB',
  'BTC',
  'ETH',
  'TUSD',
  'DAI',
  'XRP',
  'TRX',
  'DOGE',
  'EURI',
  'SOL',
  'TRY',
  'EUR',
  'BRL',
  'ARS',
  'COP',
  'CZK',
  'JPY',
  'MXN',
  'PLN',
  'RON',
  'UAH',
  'ZAR',
];
