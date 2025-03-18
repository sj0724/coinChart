'use client';

import Button from '@/components/button';
import useCoinStore from '@/store/useCoinStore';

export default function TradingBoard() {
  const { price, amountBid, amountAsk } = useCoinStore();
  return (
    <div className='w-full flex border rounded-md p-3 gap-3'>
      <div className='w-1/2 flex flex-col gap-2'>
        <p className='text-lg font-bold'>매도</p>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Price :</p>
            <p>{price || 0}</p>
          </div>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Amount :</p>
            <p>{amountAsk || 0}</p>
          </div>
        </div>
        <Button color='red'>거래하기</Button>
      </div>
      <div className='w-1/2 flex flex-col gap-2'>
        <p className='text-lg font-bold'>매수</p>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Price :</p>
            <p>{price || 0}</p>
          </div>
          <div className='flex justify-between border rounded-md p-2'>
            <p>Amount :</p>
            <p>{amountBid || 0}</p>
          </div>
        </div>
        <Button color='green'>거래하기</Button>
      </div>
    </div>
  );
}
