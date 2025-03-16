export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : `${process.env.NEXT_PUBLIC_APP_URL}/api`;

export const BASE_WS_URL = 'wss://stream.binance.com:9443/ws';

export const BASE_BINANCE_URL = 'https://api.binance.com/api/v3';

export const DEFAULT_STALE_TIME = 3 * 60 * 1000; // 캐싱 유지 3분
export const LIMIT = 200; // 데이터 갯수

export const DEFAULT_CURRENCY = 'USDT';
