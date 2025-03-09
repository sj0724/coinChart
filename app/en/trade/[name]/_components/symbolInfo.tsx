'use client';

import { BASE_WS_URL } from '@/lib/constance';
import useCoinStatusStore from '@/store/useCoinStatusStore';
import { SymbolDataByWS } from '@/types/binance';
import { formatNumber } from '@/utils/formatNumber';
import { useEffect, useState } from 'react';

interface Props {
  symbol: string;
}

export default function SymbolInfo({ symbol }: Props) {
  const [detail, setDetail] = useState<SymbolDataByWS | null>(null);
  const { status } = useCoinStatusStore();
  useEffect(() => {
    const lowerSymbol = symbol.toLowerCase();

    const socket = new WebSocket(`${BASE_WS_URL}/${lowerSymbol}@ticker`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetail(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [symbol]);

  return (
    <div className='h-16 p-4 flex items-center justify-between gap-3 border rounded-md w-full'>
      {!detail ? (
        <div className='h-7 bg-gray-100 rounded-md' />
      ) : (
        <>
          <div className='flex gap-2'>
            <p className='text-xl font-semibold'>{symbol}</p>
            <p
              className={`text-xl font-semibold ${
                status ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatNumber(detail?.c)}
            </p>
          </div>
          <div className='flex gap-4'>
            <div className='flex flex-col text-xs w-20'>
              <p className='text-gray-500'>24h Change</p>
              <div
                className={`flex gap-1 ${
                  Number(detail.P) < 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                <p>{formatNumber(detail.p)}</p>
                <p>{Number(detail.P).toFixed(2)}%</p>
              </div>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h High</p>
              <p>{formatNumber(detail.h)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Low</p>
              <p>{formatNumber(detail.l)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Volume - count</p>
              <p>{formatNumber(detail.v)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Volume - currency</p>
              <p>{formatNumber(detail.q)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
