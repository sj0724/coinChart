'use client';

import { Order, OrderType } from '@/store/useOrderStore';
import { Wallet } from '@/types/order';

export const orderCalculator = (
  type: OrderType,
  orderData: Order,
  symbol: string
) => {
  const localStorageInvest = localStorage.getItem('investor');
  const localStorageWallet = localStorage.getItem('wallet');

  if (localStorageInvest && localStorageWallet) {
    const existingInvestData = JSON.parse(localStorageInvest);
    const existingWalletData: Wallet = JSON.parse(localStorageWallet);

    if (type === 'ask') {
      const updatedWallet = existingWalletData.map((item) =>
        item.symbol === symbol
          ? { ...item, amount: Number(item.amount) - orderData.amount }
          : item
      );

      // 업데이트된 데이터를 다시 localStorage에 저장
      localStorage.setItem('wallet', JSON.stringify(updatedWallet));
    } else if (type === 'bid') {
      // 매수일 경우 투자 금액 차감
      const totalCost = orderData.price * orderData.amount;
      if (Number(existingInvestData.current) >= totalCost) {
        existingInvestData.current -= totalCost;

        // 매수한 코인을 wallet에 추가
        const existingCoin = existingWalletData.find(
          (item) => item.symbol === symbol
        );
        if (existingCoin) {
          existingCoin.amount = Number(existingCoin.amount);
          existingCoin.amount += orderData.amount;
        } else {
          existingWalletData.push({ symbol, amount: orderData.amount });
        }

        // 업데이트된 데이터를 localStorage에 저장
        localStorage.setItem('investor', JSON.stringify(existingInvestData));
        localStorage.setItem('wallet', JSON.stringify(existingWalletData));
      } else {
        console.error('잔액 부족');
      }
    }
  }
};
