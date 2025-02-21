import { SymbolData } from '@/types/binance';
import { formatNumber } from '@/utils/formatNumber';

interface Props {
  name: string;
}

export default async function SymbolInfo({ name }: Props) {
  const data = await fetch(`http://localhost:3000/api/detail?name=${name}`);
  const result: SymbolData = await data.json();
  return (
    <div className='h-16 p-4 flex items-center justify-between gap-3 border rounded-md w-[750px]'>
      <div className='flex gap-2'>
        <p className='text-xl font-semibold'>{name}</p>
        <p className='text-xl font-semibold'>
          {formatNumber(result.lastPrice)}
        </p>
      </div>
      <div className='flex gap-4'>
        <div className='flex flex-col text-xs'>
          <p className='text-gray-500'>24h High</p>
          <p>{formatNumber(result.highPrice)}</p>
        </div>
        <div className='flex flex-col text-xs'>
          <p className='text-gray-500'>24h Low</p>
          <p>{formatNumber(result.lowPrice)}</p>
        </div>
        <div className='flex flex-col text-xs'>
          <p className='text-gray-500'>24h Volume - count</p>
          <p>{formatNumber(result.volume)}</p>
        </div>
        <div className='flex flex-col text-xs'>
          <p className='text-gray-500'>24h Volume - currency</p>
          <p>{formatNumber(result.quoteVolume)}</p>
        </div>
      </div>
    </div>
  );
}
