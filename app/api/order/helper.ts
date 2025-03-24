import { BASE_BINANCE_URL } from '@/lib/constance';
import { AggTradeData, Order } from '@/types/binance';
import { supabase } from '@/utils/supabase';
import { getUserData } from '../user/helper';

export type TradeOrder = {
  symbol: string;
  price: number;
  amount: number;
  type: 'ASK' | 'BID';
};

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

export const getOrder = async () => {
  const userData = await getUserData();
  if (userData) {
    const { data } = await supabase
      .from('order')
      .select('*')
      .eq('userId', userData?.id);
    return data;
  }
};

export const createOrder = async (order: TradeOrder) => {
  const userData = await getUserData();
  if (userData) {
    const { data } = await supabase.from('order').insert({
      userId: userData.id,
      symbol: order.symbol,
      price: order.price,
      amount: order.amount,
      type: order.type,
    });
    if (data) {
      return { success: true };
    } else {
      return { success: true };
    }
  }
};
