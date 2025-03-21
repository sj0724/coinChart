'use client';

import { useWebSocketStore } from '@/store/useWebsocketStore';
import { formatNumber } from '@/utils/formatNumber';

export function CurrentSymbolPrice() {
  const symbolInfo = useWebSocketStore((state) => state.aggTrade);
  if (symbolInfo[0])
    return (
      <div>
        {symbolInfo[0] ? (
          <p className='font-bold'>{formatNumber(symbolInfo[0].p)}</p>
        ) : (
          <div className='rounde p-2 bg-gray-400' />
        )}
      </div>
    );
}
