import { SymbolData } from '@/types/binance';
import SymbolListItem from './symbolListItem';

export default async function SymbolList() {
  const sortBy = 'price';
  const currency = 'USDT';
  const list = await fetch(
    `http://localhost:3000/api/totalList?sortBy=${sortBy}&currency=${currency}`
  );
  const result: SymbolData[] = await list.json();
  return (
    <div className='relative rounded-lg border h-[400px] max-w-[350px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex w-full justify-between pt-3 px-3'>
        <p className='text-lg'>List</p>
        <div className='flex gap-2'>
          <p>{currency}</p>
          <p>{sortBy}</p>
        </div>
      </div>
      <ul className='flex flex-col'>
        {result.map((item) => (
          <li key={item.symbol}>
            <SymbolListItem symbol={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
