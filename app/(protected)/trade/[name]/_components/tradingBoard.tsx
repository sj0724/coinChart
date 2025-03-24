'use client';

import { createOrder } from '@/app/api/order/helper';
import Button from '@/components/button';
import { useToast } from '@/hooks/use-toast';
import useCoinStore from '@/store/useCoinStore';
import useOrderStore from '@/store/useOrderStore';
import { ChangeEvent, useEffect, useState } from 'react';

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
  const [askOrder, setAskOrder] = useState<TradeOrder | null>(null);
  const [bidOrder, setBidOrder] = useState<TradeOrder | null>(null);
  const { toast } = useToast();
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
    if (order) {
      const result = await createOrder(order);
      if (result) {
        setOrder(type, [result]);
      }
      toast({
        description: `${order.symbol} : ${order.price} ${order.amount}`,
      });
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
    <div className='w-full flex bg-white rounded-md p-4 gap-4 h-1/3'>
      <div className='w-1/2 flex flex-col gap-3'>
        <p className='text-lg font-bold text-red-500'>매도</p>
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
            <p>Amount :</p>
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
        <p className='text-lg font-bold text-green-500'>매수</p>
        <div className='flex flex-col gap-2'>
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
            <p>Amount :</p>
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
