'use client';

import useCoinStatusStore from '@/store/useCoinStatusStore';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { formatNumber } from '@/utils/formatNumber';
import { useEffect } from 'react';

export default function TradingList({ symbol }: { symbol: string }) {
  const { aggTrade, setSymbol } = useWebSocketStore();
  const { setStatus } = useCoinStatusStore();

  useEffect(() => {
    if (aggTrade.length > 0 && aggTrade[0].m) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }, [aggTrade]);

  useEffect(() => {
    setSymbol(symbol);
  }, []);

  return (
    <div className='p-4 border rounded-md h-[405px] overflow-y-scroll'>
      <h2 className='text-lg font-bold'>실시간 거래 데이터 ({symbol})</h2>
      <ul className='mt-2 flex flex-col gap-2 text-sm'>
        <li className='flex justify-between'>
          <p>Price</p>
          <p>Amount</p>
          <p>Time</p>
        </li>
        {aggTrade.map((trade, index) => (
          <li
            key={index}
            className='rounded-md text-center flex justify-between'
          >
            <p className='w-16 text-left'>
              <span
                className={`${trade.m ? 'text-red-600' : 'text-green-500'}`}
              >
                {formatNumber(trade.p)}
              </span>
            </p>
            <p className='w-16 text-right'>
              <span>{Number(trade.q).toFixed(5)}</span>
            </p>
            <p className='w-24 text-right'>
              {new Date(trade.T).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
