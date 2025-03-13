export type SymbolData = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

export type Order = {
  lastUpdateId: number;
  bids: string[][]; // first : PRICE, seconde : QTY
  asks: string[][];
};

export type SymbolDataByWS = {
  e: '24hrTicker';
  E: number; // Event time (Unix timestamp in milliseconds)
  s: string; // Symbol (e.g., "BNBBTC")
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (price before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time (Unix timestamp)
  C: number; // Statistics close time (Unix timestamp)
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
};

export type TradeDataByWS = {
  e: 'trade'; // Event type
  E: number; // Event time (Unix timestamp in milliseconds)
  s: string; // Symbol (e.g., "BNBBTC")
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time (Unix timestamp in milliseconds)
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
};

interface RateLimit {
  rateLimitType?: string;
  interval?: string;
  intervalNum?: number;
  limit?: number;
}

interface SymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision?: number; // Deprecated in future API versions
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  otoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: any[]; // Filters are optional and can have different structures
  permissions: string[];
  permissionSets: string[][];
  defaultSelfTradePreventionMode: string;
  allowedSelfTradePreventionModes: string[];
}

interface SORInfo {
  baseAsset: string;
  symbols: string[];
}

export interface ExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: RateLimit[];
  exchangeFilters: any[];
  symbols: SymbolInfo[];
  sors?: SORInfo[]; // Optional field for SOR availability
}
