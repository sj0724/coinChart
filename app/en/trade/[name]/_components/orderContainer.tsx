'use client';

import { numberWithUnit } from '@/utils/numberWithUnit';
import useCoinStore from '@/store/useCoinStore';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { useEffect } from 'react';
import { fetchDepthList } from '@/app/api/order/helper';

interface Props {
  symbolName: string;
}

export default function OrderBookContainer({ symbolName }: Props) {
  const { setPrice, setAmountBid, setAmountAsk } = useCoinStore();
  const depthUpdate = useWebSocketStore((state) => state.depthUpdate);
  const setDepthUpdate = useWebSocketStore((state) => state.setDepthUpdate);
  const { asks, bids } = depthUpdate;

  const settingAskState = (index: number) => {
    const newPrice = Number(asks[index][0]);
    const newArr = asks.slice(index); // askList의 index부터 끝까지 자른 배열
    const totalVolume = newArr
      .map((item) => item[1]) // item[1]을 추출하여 새로운 배열을 생성
      .reduce((acc, volume) => acc + Number(volume), 0); // 배열의 모든 값을 더함

    setPrice(newPrice.toFixed(2));
    setAmountBid(totalVolume.toFixed(5));
    setAmountAsk('');
  };

  const settingBidState = (index: number) => {
    const newPrice = Number(bids[index][0]);
    const newArr = bids.slice(0, index); // bidList의 index부터 끝까지 자른 배열
    const totalVolume = newArr
      .map((item) => item[1]) // item[1]을 추출하여 새로운 배열을 생성
      .reduce((acc, volume) => acc + Number(volume), 0); // 배열의 모든 값을 더함

    setPrice(newPrice.toFixed(2));
    setAmountAsk(totalVolume.toFixed(5));
    setAmountBid('');
  };

  useEffect(() => {
    const getDepthData = async () => {
      const result = await fetchDepthList(symbolName);
      if (result) {
        setDepthUpdate({ asks: result.asks, bids: result.bids });
      }
    };
    getDepthData();
  }, [symbolName]);

  return (
    <div className='border rounded-md p-3 w-[300px] flex flex-col gap-2'>
      <p className='font-semibold'>Order Book</p>
      <div className='flex justify-between text-sm text-gray-500 py-2'>
        <p className='w-1/3'>Price</p>
        <p className='w-1/3 text-end'>Amount</p>
        <p className='w-1/3 text-end'>Total</p>
      </div>
      <ul className='w-full flex flex-col gap-1'>
        {asks.map((item, index) => (
          <li
            key={index}
            className='relative flex text-xs justify-between hover:bg-gray-100 cursor-pointer'
            onClick={() => settingAskState(index)}
          >
            <p className='w-1/3 text-red-600'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
            <div
              className='absolute right-0 bg-red-500 opacity-10 h-full'
              style={{
                width: `${Number(item[1]) * 100}%`,
                maxWidth: '100%',
              }}
            />
          </li>
        ))}
      </ul>
      <ul className='w-full flex flex-col gap-1'>
        {bids.map((item, index) => (
          <li
            key={index}
            className='relative flex text-xs justify-between hover:bg-gray-100 cursor-pointer'
            onClick={() => settingBidState(index)}
          >
            <p className='w-1/3 text-green-500'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
            <div
              className='absolute right-0 bg-green-500 opacity-10 h-full'
              style={{
                width: `${Number(item[1]) * 100}%`,
                maxWidth: '100%',
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
