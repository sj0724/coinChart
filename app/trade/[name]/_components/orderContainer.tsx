import { Order } from '@/types/binance';
import { numberWithUnit } from '@/utils/numberWithUnit';

interface Props {
  name: string;
}

export default async function OrderBookContainer({ name }: Props) {
  const data = await fetch(`http://localhost:3000/api/order?name=${name}`);
  const result: Order = await data.json();
  const askList = result.asks.reverse();
  const bidList = result.bids;

  return (
    <div className='border rounded-md p-3 w-[300px]'>
      <p className='font-semibold'>Order Book</p>
      <div className='flex justify-between text-sm text-gray-500 py-2'>
        <p className='w-1/3'>Price</p>
        <p className='w-1/3 text-end'>Amount</p>
        <p className='w-1/3 text-end'>Total</p>
      </div>
      <ul className='w-full'>
        {askList.map((item, index) => (
          <li
            key={index}
            className='flex text-xs justify-between hover:bg-gray-100'
          >
            <p className='w-1/3 text-red-600'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
          </li>
        ))}
      </ul>
      <ul>
        {bidList.map((item, index) => (
          <li
            key={index}
            className='flex text-xs justify-between hover:bg-gray-100'
          >
            <p className='w-1/3 text-green-500'>{Number(item[0]).toFixed(2)}</p>
            <p className='w-1/3 text-end'>{Number(item[1]).toFixed(5)}</p>
            <p className='w-1/3 text-end'>
              {numberWithUnit(Number(item[0]) * Number(item[1]))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
