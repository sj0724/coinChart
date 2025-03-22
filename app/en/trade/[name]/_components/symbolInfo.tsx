'use client';

import useCoinStatusStore from '@/store/useCoinStatusStore';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { formatNumber } from '@/utils/formatNumber';

interface Props {
  symbol: string;
}

export default function SymbolInfo({ symbol }: Props) {
  const { status } = useCoinStatusStore();
  const symbolInfo = useWebSocketStore((state) => state.symboInfo);

  return (
    <div className='h-1/6 p-4 flex items-center justify-between gap-3 bg-white rounded-md w-full overflow-x-scroll no-scrollbar'>
      {!symbolInfo ? (
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
              {formatNumber(symbolInfo.c)}
            </p>
          </div>
          <div className='flex gap-4 text-nowrap pl-5'>
            <div className='flex flex-col text-xs w-20'>
              <p className='text-gray-500'>24h Change</p>
              <div
                className={`flex gap-1 ${
                  Number(symbolInfo.c) < Number(symbolInfo.o)
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                <p>
                  {formatNumber(
                    String(Number(symbolInfo.c) - Number(symbolInfo.o))
                  )}
                </p>
                <p>
                  {(
                    ((Number(symbolInfo.c) - Number(symbolInfo.o)) /
                      Number(symbolInfo.o)) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h High</p>
              <p>{formatNumber(symbolInfo.h)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Low</p>
              <p>{formatNumber(symbolInfo.l)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Volume(count)</p>
              <p>{formatNumber(symbolInfo.v)}</p>
            </div>
            <div className='flex flex-col text-xs'>
              <p className='text-gray-500'>24h Volume(currency)</p>
              <p>{formatNumber(symbolInfo.q)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
