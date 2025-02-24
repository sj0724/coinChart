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
  bids: string[]; // first : PRICE, seconde : QTY
  asks: string[];
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
