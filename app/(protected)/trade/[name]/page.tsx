'use client';

import SymbolInfo from './_components/symbolInfo';
import OrderBookContainer from './_components/orderContainer';
import Chart from './_components/chart';
import TradingList from './_components/tradingList';
import SymbolList from './_components/symbolList';
import TradingBoard from './_components/tradingBoard';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { use, useEffect } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: symbolName } = use(params);
  const setSymbol = useWebSocketStore((state) => state.setSymbol);

  useEffect(() => {
    setSymbol(symbolName);
  }, [symbolName]);

  return (
    <div className='grid w-full max-w-[1500px] gap-2 p-2 grid-cols-1 md:grid-cols-3 xl:grid-cols-5 xl:h-[950px] h-fit'>
      <OrderBookContainer symbolName={symbolName} />
      <div className='flex flex-col gap-2 md:col-span-2 xl:col-span-3 h-fit'>
        <SymbolInfo symbol={symbolName} />
        <Chart symbol={symbolName} />
        <TradingBoard symbol={symbolName} />
      </div>
      <div className='flex flex-col gap-2 md:flex-row xl:flex-col md:col-span-3 xl:col-span-1 xl:row-span-2 h-full'>
        <SymbolList />
        <TradingList symbol={symbolName} />
      </div>
    </div>
  );
}
