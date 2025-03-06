'use client';

import { Miniticker } from '@/types/streams';
import { formatNumber } from '@/utils/formatNumber';
import Link from 'next/link';

interface Props {
  symbol: Miniticker;
}

export default function SymbolListItem({ symbol }: Props) {
  const changePercent =
    ((Number(symbol.c) - Number(symbol.o)) / Number(symbol.o)) * 100;
  return (
    <Link href={`/en/trade/${symbol.s}`}>
      <div className='py-2 px-3 flex justify-between hover:bg-gray-100 text-sm'>
        <p>{symbol.s}</p>
        <div className='flex gap-5 text-center items-center'>
          <p>{formatNumber(symbol.c)}</p>
          <p
            className={`${
              changePercent > 0 ? 'text-green-500' : 'text-red-600'
            } text-xs`}
          >
            {changePercent > 0 && '+'}
            {changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </Link>
  );
}
