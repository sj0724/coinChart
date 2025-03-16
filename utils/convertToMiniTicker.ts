import { SymbolData } from '@/types/binance';
import { Miniticker } from '@/types/streams';

export const convertToMiniTicker = (data: SymbolData[]): Miniticker[] => {
  return data.map((item) => ({
    e: '24hrMiniTicker',
    E: item.closeTime,
    s: item.symbol,
    c: item.lastPrice,
    o: item.openPrice,
    h: item.highPrice,
    l: item.lowPrice,
    v: item.volume,
    q: item.quoteVolume,
  }));
};
