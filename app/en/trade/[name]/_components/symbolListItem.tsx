'use client';

import { SymbolData } from '@/types/binance';
import { formatNumber } from '@/utils/formatNumber';
import Link from 'next/link';

interface Props {
  symbol: SymbolData;
}

export default function SymbolListItem({ symbol }: Props) {
  const isPlus = Number(symbol.priceChangePercent) > 0;
  return (
    <Link href={`/en/trade/${symbol.symbol}`}>
      <div className='py-2 px-3 flex justify-between hover:bg-gray-100 text-sm'>
        <p>{symbol.symbol}</p>
        <div className='flex gap-5 text-center items-center'>
          <p>{formatNumber(symbol.lastPrice)}</p>
          <p
            className={`${isPlus ? 'text-green-500' : 'text-red-600'} text-xs`}
          >
            {isPlus && '+'}
            {symbol.priceChangePercent}%
          </p>
        </div>
      </div>
    </Link>
  );
}
