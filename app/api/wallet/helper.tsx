import { DbOrder } from '@/types/dbData';
import { getUserData } from '../user/helper';
import { supabase } from '@/utils/supabase';

export const getWallet = async () => {
  const user = await getUserData();
  if (!user) return;
  const wallet = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', user.id);

  if (wallet.data) {
    return wallet.data;
  }
};

export const updateWallet = async (order: DbOrder) => {
  const user = await getUserData();
  if (!user) return;
  const wallet = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', user.id)
    .eq('symbol', order.symbol);
  if (wallet.data?.length === 0) {
    // 지갑에 자산 없는 경우 새로 생성
    await supabase
      .from('wallet')
      .insert({ user_id: user.id, symbol: order.symbol, amount: order.amount });
  } else {
    // 이미 자산이 있는 경우 거래 타입에 따라 갯수 업데이트(매수: 추가)
    const symbolWallet = wallet.data![0];
    const newAmount = symbolWallet.amount + order.amount;
    await supabase
      .from('wallet')
      .update({ amount: newAmount })
      .eq('id', symbolWallet.id);
  }
};
