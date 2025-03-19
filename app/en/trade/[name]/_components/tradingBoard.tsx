'use client';

import Button from '@/components/button';
import useCoinStore from '@/store/useCoinStore';
import useOrderStore, { OrderType } from '@/store/useOrderStore';
import { ChangeEvent, useEffect, useState } from 'react';

export default function TradingBoard() {
  const { price, amountBid, amountAsk } = useCoinStore();
  const setOrder = useOrderStore((state) => state.setOrder);

  const [askOrder, setAskOrder] = useState({ price: 0, amount: 0 });
  const [bidOrder, setBidOrder] = useState({ price: 0, amount: 0 });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'ask' | 'bid',
    field: 'price' | 'amount'
  ) => {
    const value = Number(e.target.value);
    if (type === 'ask') {
      setAskOrder((prev) => ({ ...prev, [field]: value }));
    } else {
      setBidOrder((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTrade = (type: OrderType) => {
    const order = type === 'ask' ? askOrder : bidOrder;
    console.log(order);
    setOrder(type, order);
  };

  useEffect(() => {
    setAskOrder({ price: price, amount: amountAsk });
    setBidOrder({ price: price, amount: amountBid });
  }, [amountAsk, amountBid, price]);

  return (
    <div className='w-full flex bg-white rounded-md p-4 gap-4 h-1/3 shadow'>
      <div className='w-1/2 flex flex-col gap-3'>
        <p className='text-lg font-bold text-red-500'>매도</p>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Price :</p>
            <input
              type='number'
              min={0.01}
              step={0.01}
              value={askOrder.price}
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
              value={askOrder.amount}
              onChange={(e) => handleChange(e, 'ask', 'amount')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
        </div>
        <Button color='red' onClick={() => handleTrade('ask')}>
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
              value={bidOrder.price}
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
              value={bidOrder.amount}
              onChange={(e) => handleChange(e, 'bid', 'amount')}
              className='text-right w-24 border-none focus:outline-none'
            />
          </div>
        </div>
        <Button color='green' onClick={() => handleTrade('bid')}>
          매수하기
        </Button>
      </div>
    </div>
  );
}
