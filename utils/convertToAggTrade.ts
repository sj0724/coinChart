import { AggTradeData } from '@/types/binance';
import { AggTrade } from '@/types/streams';

export const convertToAggTrade = (
  data: AggTradeData[],
  symbol: string
): AggTrade[] => {
  return data.map((item) => ({
    e: 'aggTrade',
    E: 0,
    s: symbol,
    a: item.a,
    p: item.p,
    q: item.q,
    f: item.f,
    l: item.l,
    T: item.T,
    m: item.m,
    M: item.M,
  }));
};
