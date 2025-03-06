export interface Ticker {
  e: '24hrTicker'; // Event type
  E: number; // Event time (timestamp)
  s: string; // Symbol (e.g., "BNBBTC")
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade before the 24hr rolling window price
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
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

export interface DepthUpdate {
  e: string; // "depthUpdate"
  E: number;
  s: string; // Symbol (ex: "BTCUSDT")
  b: [string, string][]; // Bids [price, quantity]
  a: [string, string][]; // Asks [price, quantity]
}

export interface AggTrade {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}
