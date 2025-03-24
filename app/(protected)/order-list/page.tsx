'use client';

import { getOrder } from '@/app/api/order/helper';
import { DbOrder } from '@/types/dbData';
import { useEffect, useState } from 'react';

export default function Page() {
  const [askOrderList, setAskOrderList] = useState<DbOrder[]>([]);
  const [bidOrderList, setBidOrderList] = useState<DbOrder[]>([]);

  useEffect(() => {
    const fetctOrder = async () => {
      const result = await getOrder();
      if (result) {
        const askArray = result.filter((item) => item.type === 'ASK');
        const bidArray = result.filter((item) => item.type === 'BID');
        setAskOrderList(askArray);
        setBidOrderList(bidArray);
      }
    };
    fetctOrder();
  }, []);

  return (
    <div>
      <p>매도 주문</p>
      <ul>
        {askOrderList.map((item) => (
          <li key={item.id} className='flex gap-2'>
            <p>{item.symbol}</p>
            <p>{item.price}$</p>
            <p>{item.amount}</p>
          </li>
        ))}
      </ul>
      <p>매수 주문</p>
      <ul>
        {bidOrderList.map((item) => (
          <li key={item.id} className='flex gap-2'>
            <p>{item.symbol}</p>
            <p>{item.price}$</p>
            <p>{item.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
