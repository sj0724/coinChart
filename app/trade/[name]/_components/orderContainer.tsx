'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/binance';
import { numberWithUnit } from '@/utils/numberWithUnit';
import useCoinStore from '@/store/useCoinStore';

interface Props {
  name: string;
}

export default function OrderBookContainer({ name }: Props) {
  const [orderData, setOrderData] = useState<Order | null>(null);
  const { setPrice, setAmountBid, setAmountAsk } = useCoinStore();

  const fetchOrderBook = async () => {
    try {
      const data = await fetch(`http://localhost:3000/api/order?name=${name}`);
      const result: Order = await data.json();
      setOrderData(result);
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 5000); // 5초마다 데이터 갱신

    return () => clearInterval(intervalId);
  }, [name, fetchOrderBook]);

  if (!orderData) {
    return <div className='border rounded-md p-3 w-[300px] h-[700px]'></div>;
  }

  const askList = [...orderData.asks].reverse();
  const bidList = orderData.bids;

  const test = (index: number) => {
    const newPrice = Number(askList[index][0]);
    const newArr = askList.slice(index); // askList의 index부터 끝까지 자른 배열
    const totalVolume = newArr
      .map((item) => item[1]) // item[1]을 추출하여 새로운 배열을 생성
      .reduce((acc, volume) => acc + Number(volume), 0); // 배열의 모든 값을 더함

    setPrice(newPrice.toFixed(2));
    setAmountBid(totalVolume.toFixed(5));
    setAmountAsk('');
  };

  const test2 = (index: number) => {
    const newPrice = Number(bidList[index][0]);
    const newArr = bidList.slice(0, index); // askList의 index부터 끝까지 자른 배열
    const totalVolume = newArr
      .map((item) => item[1]) // item[1]을 추출하여 새로운 배열을 생성
      .reduce((acc, volume) => acc + Number(volume), 0); // 배열의 모든 값을 더함

    setPrice(newPrice.toFixed(2));
    setAmountAsk(totalVolume.toFixed(5));
    setAmountBid('');
  };

  return (
    <div className='border rounded-md p-3 w-[300px] flex flex-col gap-2'>
      <p className='font-semibold'>Order Book</p>
      <div className='flex justify-between text-sm text-gray-500 py-2'>
        <p className='w-1/3'>Price</p>
        <p className='w-1/3 text-end'>Amount</p>
        <p className='w-1/3 text-end'>Total</p>
      </div>
      <ul className='w-full flex flex-col gap-1'>
        {askList.map((item, index) => (
          <li
            key={index}
            className='flex text-xs justify-between hover:bg-gray-100 cursor-pointer'
            onClick={() => test(index)}
          >
            <p className='w-1/3 text-red-600'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
          </li>
        ))}
      </ul>
      <ul className='w-full flex flex-col gap-1'>
        {bidList.map((item, index) => (
          <li
            key={index}
            className='flex text-xs justify-between hover:bg-gray-100 cursor-pointer'
            onClick={() => test2(index)}
          >
            <p className='w-1/3 text-green-500'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
