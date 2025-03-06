'use client';

import { Ticker } from '@/types/streams';
import { formatNumber } from '@/utils/formatNumber';
import Link from 'next/link';

interface Props {
  symbol: Ticker;
}

export default function SymbolListItem({ symbol }: Props) {
  const isPlus = Number(symbol.P) >= 0;
  return (
    <Link href={`/en/trade/${symbol.s}`}>
      <div className='py-2 px-3 flex justify-between hover:bg-gray-100 text-sm'>
        <p>{symbol.s}</p>
        <div className='flex gap-5 text-center items-center'>
          <p>{formatNumber(symbol.c)}</p>
          <p
            className={`${isPlus ? 'text-green-500' : 'text-red-600'} text-xs`}
          >
            {isPlus && '+'}
            {symbol.P}%
          </p>
        </div>
      </div>
    </Link>
  );
}
