'use client';

import { numberWithUnit } from '@/utils/numberWithUnit';
import useCoinStore from '@/store/useCoinStore';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { useEffect } from 'react';
import { fetchDepthList } from '@/app/api/order/helper';
import { CurrentSymbolPrice } from './currentSymbolPrice';

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
    setPrice(Number(newPrice.toFixed(2)));
    setAmountBid(Number(totalVolume.toFixed(5)));
    setAmountAsk(0);
  };

  const settingBidState = (index: number) => {
    const newPrice = Number(bids[index][0]);
    const newArr = bids.slice(0, index + 1); // bidList의 index부터 끝까지 자른 배열
    const totalVolume = newArr
      .map((item) => item[1]) // item[1]을 추출하여 새로운 배열을 생성
      .reduce((acc, volume) => acc + Number(volume), 0); // 배열의 모든 값을 더함
    setPrice(Number(newPrice.toFixed(2)));
    setAmountAsk(Number(totalVolume.toFixed(5)));
    setAmountBid(0);
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
    <div className='rounded-md p-2 flex flex-col gap-2 bg-white md:row-span-1 xl:col-span-1 h-full'>
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
      <CurrentSymbolPrice />
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
