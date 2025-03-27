import { getWallet } from '@/app/api/wallet/helper';
import Link from 'next/link';

export default async function Page() {
  const data = await getWallet();

  if (!data || data.length === 0)
    return (
      <div className='flex gap-2 h-[calc(100vh-64px)] p-2 w-full justify-center'>
        <div className='flex flex-col bg-white p-2 rounded max-w-[400px] w-full'>
          <p className='font-bold text-lg p-2 border-b mb-2'>지갑</p>
          <div className='flex flex-col items-center justify-center m-3 rounded h-full bg-gray-100 font-semibold'>
            소유한 자산이 없습니다.
          </div>
        </div>
      </div>
    );

  return (
    <div className='flex gap-2 h-[calc(100vh-64px)] p-2 w-full justify-center'>
      <div className='flex flex-col bg-white p-2 rounded max-w-[400px] w-full'>
        <p className='font-bold text-lg p-2 border-b mb-2'>지갑</p>
        <ul className='flex flex-col gap-2'>
          {data.map((item) => (
            <li key={item.id}>
              <Link href={`/trade/${item.symbol}`}>
                <div className='flex p-2 justify-between shadow rounded hover:bg-gray-100 text-sm'>
                  <p className='font-bold'>{item.symbol}</p>
                  <p>{item.amount}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
