import { BASE_BINANCE_URL } from '@/lib/constance';
import { AggTradeData, Order } from '@/types/binance';

export const fetchDepthList = async (symbol: string) => {
  try {
    const request = await fetch(
      `${BASE_BINANCE_URL}/depth?symbol=${symbol}&limit=1000`
    );
    const depthList: Order = await request.json();

    const askList = Array.isArray(depthList?.asks)
      ? [...depthList.asks]
          .filter((ask) => ask[1] !== '0.00000000')
          .slice(0, 20)
          .reverse()
      : [];
    const bidList = Array.isArray(depthList?.bids)
      ? depthList?.bids.filter((bids) => bids[1] !== '0.00000000').slice(0, 20)
      : [];

    return { asks: askList ?? [], bids: bidList ?? [] };
  } catch (error) {
    console.error('Error fetching order book:', error);
  }
};

export const fetchAggTradeData = async (symbol: string) => {
  try {
    const request = await fetch(
      `${BASE_BINANCE_URL}/aggTrades?symbol=${symbol}&limit=30`
    );
    const aggTradeDate: AggTradeData[] = await request.json();

    return aggTradeDate;
  } catch (error) {
    console.error('Error fetching order book:', error);
  }
};
