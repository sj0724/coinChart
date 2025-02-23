'use client';

import { formatNumber } from '@/utils/formatNumber';
import { useEffect, useRef, useState } from 'react';

const BASE_URL = 'wss://stream.binance.com:9443/ws';

interface Trade {
  price: string;
  qty: string;
  time: number;
  type: boolean;
}

export default function TradingList({ symbol }: { symbol: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const lowerSymbol = symbol.toLowerCase();

    const socket = new WebSocket(`${BASE_URL}/${lowerSymbol}@trade`);

    socket.onopen = () => {
      console.log('WebSocket 연결');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setTrades((prevTrades) => [
        { price: data.p, qty: data.q, time: data.T, type: data.m },
        ...prevTrades.slice(0, 29),
      ]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [symbol]);

  return (
    <div className='p-4 border rounded-md h-80 overflow-y-scroll'>
      <h2 className='text-lg font-bold'>실시간 거래 데이터 ({symbol})</h2>
      <ul className='mt-2 flex flex-col gap-2 text-sm'>
        <li className='flex justify-between'>
          <p>Price</p>
          <p>Amount</p>
          <p>Time</p>
        </li>
        {trades.map((trade, index) => (
          <li
            key={index}
            className='rounded-md text-center flex justify-between'
          >
            <p className='w-16 text-left'>
              <span
                className={`${trade.type ? 'text-red-600' : 'text-green-500'}`}
              >
                {formatNumber(trade.price)}
              </span>
            </p>
            <p className='w-16 text-right'>
              <span>{Number(trade.qty).toFixed(5)}</span>
            </p>
            <p className='w-24 text-right'>
              {new Date(trade.time).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
