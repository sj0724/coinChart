'use client';

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
        <button
          type='button'
          className='bg-red-500 w-full rounded-md p-1 text-white font-bold hover:bg-red-500/50 active:bg-red-700'
        >
          거래하기
        </button>
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
        <button
          type='button'
          className='bg-green-500 w-full rounded-md p-1 text-white font-bold hover:bg-green-500/50 active:bg-green-700'
        >
          거래하기
        </button>
      </div>
    </div>
  );
}
