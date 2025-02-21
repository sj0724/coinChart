import { Suspense } from 'react';
import SymbolListSkeleton from './_components/symbolListSkeleton';
import SymbolListContainer from './_components/symbolListContainer';
import SymbolInfo from './_components/symbolInfo';
import OrderBookContainer from './_components/orderContainer';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const symbolName = (await params).name;
  return (
    <div className='flex w-full'>
      <OrderBookContainer name={symbolName} />
      <div className='flex flex-col'>
        <SymbolInfo name={symbolName} />
        <div className='bg-gray-200 rounded-lg h-[500px]' />
      </div>
      <Suspense fallback={<SymbolListSkeleton />}>
        <SymbolListContainer />
      </Suspense>
    </div>
  );
}
