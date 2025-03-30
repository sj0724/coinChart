import { BASE_BINANCE_URL } from '@/lib/constance';
import { AggTradeData, Order } from '@/types/binance';
import { supabase } from '@/utils/supabase';
import { getUserData, updateUserData } from '../user/helper';
import { TradeOrder } from '@/app/(protected)/trade/[name]/_components/tradingBoard';
import { getWallet, updateWallet } from '../wallet/helper';

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

export const getSuccessOrder = async (page: number = 1, limit: number = 1) => {
  const start = (page - 1) * limit;
  const end = page * limit - 1;

  const userData = await getUserData();
  if (userData) {
    const { data, count } = await supabase
      .from('order')
      .select('*', { count: 'exact' })
      .eq('userId', userData.id)
      .eq('succeed', true)
      .order('created_at', { ascending: false })
      .range(start, end);

    return { data: data ?? [], totalCount: count ?? 0 };
  }

  return { data: [], totalCount: 0 };
};

export const getHoldingOrder = async () => {
  const userData = await getUserData();
  if (userData) {
    const { data } = await supabase
      .from('order')
      .select('*')
      .eq('userId', userData?.id)
      .eq('succeed', false);
    return data;
  }
};

export const createOrder = async (order: TradeOrder) => {
  const userData = await getUserData();
  if (userData) {
    const result = await supabase
      .from('order')
      .insert({
        userId: userData.id,
        symbol: order.symbol,
        price: order.price,
        amount: order.amount,
        type: order.type,
      })
      .select()
      .single();
    if (result.status === 201 && result.data) {
      if (order.type === 'BID') {
        await supabase
          .from('users')
          .update({ invest: userData.invest! - order.price * order.amount })
          .eq('id', userData.id);
      } else {
        const walletList = await getWallet();
        const filteredWallet = walletList?.find(
          (item) => item.symbol === order.symbol
        );
        if (!filteredWallet) return;
        await supabase
          .from('wallet')
          .update({ amount: filteredWallet.amount - order.amount })
          .eq('id', filteredWallet.id);
      }
      return result.data;
    }
  }
};

export const succeedOrder = async (id: string) => {
  const result = await supabase
    .from('order')
    .update({ succeed: true })
    .eq('id', id);
  return result;
};

export const cancelOrder = async (id: string) => {
  const result = await supabase
    .from('order')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (result.data) {
    if (result.data.type === 'ASK') {
      updateWallet(result.data);
    } else {
      const returnInvest = result.data.amount * result.data.price;
      updateUserData(returnInvest);
    }
  }
};
