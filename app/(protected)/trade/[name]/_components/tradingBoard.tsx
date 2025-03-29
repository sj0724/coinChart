'use client';

import { createOrder } from '@/app/api/order/helper';
import { getUserData } from '@/app/api/user/helper';
import { getWallet } from '@/app/api/wallet/helper';
import Button from '@/components/button';
import useCoinStore from '@/store/useCoinStore';
import useOrderStore from '@/store/useOrderStore';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  symbol: string;
}

export type TradeType = 'ASK' | 'BID';

export type TradeOrder = {
  symbol: string;
  price: number;
  amount: number;
  type: TradeType;
};

export default function TradingBoard({ symbol }: Props) {
  const { price, amountBid, amountAsk } = useCoinStore();
  const setOrder = useOrderStore((state) => state.setOrder);
  const { refetch: refetchUserData } = useQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData(),
    staleTime: 1000 * 5, // 5초 동안은 캐싱된 데이터 사용, 최신 데이터를 위한 짧은 유효 시간
  });

  const { refetch: refetchWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => getWallet(),
    staleTime: 1000 * 5,
  });
  const [askOrder, setAskOrder] = useState<TradeOrder | null>(null);
  const [bidOrder, setBidOrder] = useState<TradeOrder | null>(null);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'ask' | 'bid',
    field: 'price' | 'amount'
  ) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) return;

    if (type === 'ask') {
      setAskOrder((prev) =>
        prev
          ? { ...prev, [field]: value }
          : { symbol: '', price: 0, amount: 0, type: 'ASK' }
      );
    } else {
      setBidOrder((prev) =>
        prev
          ? { ...prev, [field]: value }
          : { symbol: '', price: 0, amount: 0, type: 'BID' }
      );
    }
  };

  const handleTrade = async (type: TradeType) => {
    const order = type === 'ASK' ? askOrder : bidOrder;
    if (!order) return;

    try {
      // 최신 데이터 가져오기 (병렬 실행)
      const [{ data: latestUserData }, { data: latestWalletData }] =
        await Promise.all([refetchUserData(), refetchWallet()]);

      if (type === 'BID' && latestUserData) {
        if (latestUserData.invest! < order.price * order.amount) {
          return toast.error('소유한 자산이 부족합니다.');
        }
      } else if (type === 'ASK' && latestWalletData) {
        const filterWallet = latestWalletData.find(
          (item) => item.symbol === symbol
        );
        if (!filterWallet || filterWallet.amount < order.amount) {
          return toast.error('소유한 자산이 부족합니다.');
        }
      }

      // 주문 요청
      const result = await createOrder(order);
      if (result) {
        setOrder(type, [result]);
        toast.success(`${order.symbol} : ${order.price} / ${order.amount}`);
        await Promise.all([refetchUserData(), refetchWallet()]); // 최신 데이터 다시 가져오기
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('거래 처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    setAskOrder({
      price: price,
      amount: amountAsk,
      symbol,
      type: 'ASK',
    });
    setBidOrder({ price: price, amount: amountBid, symbol, type: 'BID' });
  }, [amountAsk, amountBid, price, symbol]);

  return (
    <div className='w-full flex bg-white rounded-md p-4 gap-4 h-1/3 text-sm md:text-base'>
      <div className='w-1/2 flex flex-col gap-3'>
        <p className='text-base md:text-lg font-bold text-red-500'>매도</p>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Price :</p>
            <input
              type='number'
              min={0.01}
              step={0.01}
              value={askOrder ? askOrder.price : 0}
              onChange={(e) => handleChange(e, 'ask', 'price')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
          <div className='flex justify-between border rounded-md p-2'>
            <p className='text-nowrap'>Amount :</p>
            <input
              type='number'
              min={0.00001}
              step={0.00001}
              value={askOrder ? askOrder.amount : 0}
              onChange={(e) => handleChange(e, 'ask', 'amount')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
        </div>
        <Button color='red' onClick={() => handleTrade('ASK')}>
          매도하기
        </Button>
      </div>
      <div className='w-1/2 flex flex-col gap-3'>
        <p className='text-base md:text-lg font-bold text-green-500'>매수</p>
        <div className='flex flex-col gap-2 '>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Price :</p>
            <input
              type='number'
              min={0.01}
              step={0.01}
              value={bidOrder ? bidOrder.price : 0}
              onChange={(e) => handleChange(e, 'bid', 'price')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
          <div className='flex justify-between border rounded-md p-2'>
            <p className='text-nowrap'>Amount :</p>
            <input
              type='number'
              min={0.00001}
              step={0.00001}
              value={bidOrder ? bidOrder.amount : 0}
              onChange={(e) => handleChange(e, 'bid', 'amount')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
        </div>
        <Button color='green' onClick={() => handleTrade('BID')}>
          매수하기
        </Button>
      </div>
    </div>
  );
}
