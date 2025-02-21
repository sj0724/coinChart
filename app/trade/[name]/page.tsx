import { Suspense } from 'react';
import SymbolListSkeleton from './_components/symbolListSkeleton';
import SymbolListContainer from './_components/symbolListContainer';
import SymbolInfo from './_components/symbolInfo';
import OrderBookContainer from './_components/orderContainer';
import Chart from './_components/chart';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const symbolName = (await params).name;
  return (
    <div className='flex w-full gap-2'>
      <OrderBookContainer name={symbolName} />
      <div className='flex flex-col gap-2'>
        <SymbolInfo name={symbolName} />
        <Chart symbol={symbolName} />
      </div>
      <Suspense fallback={<SymbolListSkeleton />}>
        <SymbolListContainer />
      </Suspense>
    </div>
  );
}
